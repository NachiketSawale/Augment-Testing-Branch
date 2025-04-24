/*
 * Copyright(c) RIB Software GmbH
 */

import { forEach, get, set } from 'lodash';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

export type Price = {
	Estimated: string;
	Adjustment: string;
	Tender: string;
	Delta: string;
	Num: number;
};

/**
 * EstimatePriceAdjustmentCalculationService
 */
export class EstimatePriceAdjustmentCalculatorService {
	private item: IEstPriceAdjustmentItemData;
	private field: string;
	private isExistUrb = false;
	private isNotEmpty = false;
	private tempValue: number | null = null;
	private temp2Value: number | null = null;
	private calculateValue: number | null = null;
	private changeAdjustment = false;
	private unCalUrbs: string[] = [];
	private price: Price = {
		Estimated: 'Estimated',
		Adjustment: 'Adjustment',
		Tender: 'Tender',
		Delta: 'Delta',
		Num: 0,
	};

	public constructor(item: IEstPriceAdjustmentItemData, field: string, value: number | null, unCalUrbs: string[]) {
		set(item, field, value);
		this.item = item;
		this.field = field;
		this.price.Num = this.extractNumberFromString(field);
		this.unCalUrbs = unCalUrbs;
		this.isNotEmpty = value !== null;
		this.changeAdjustment = item.UrAdjustment === null && item.UrTender === null;
	}

	private extractNumberFromString(input: string): number {
		const regex = /\d+/;
		const result = input.match(regex);
		if (result) {
			return parseInt(result[0], 10);
		} else {
			return 0;
		}
	}

	private safeOperation(operation: string, operand1: number | null | undefined, operand2: number | null | undefined): number | null {
		if (operand1 === null || operand2 === null || operand1 === undefined || operand2 === undefined) {
			return null;
		}
		if (typeof operand1 !== 'number' || typeof operand2 !== 'number') {
			return null;
		}
		switch (operation) {
			case '+':
				return operand1 + operand2;
			case '-':
				return operand1 - operand2;
			case '*':
				return operand1 * operand2;
			case '/':
				return operand2 !== 0 ? operand1 / operand2 : null;
			default:
				return null;
		}
	}

	public recalculate() {
		if (this.item && this.field) {
			this.calculate();
		}
	}

	private fieldWq = ['WqQuantity', 'WqEstimatedPrice', 'WqAdjustmentPrice', 'WqTenderPrice', 'WqDeltaPrice'];
	private fieldAq = ['AqQuantity', 'AqEstimatedPrice', 'AqAdjustmentPrice', 'AqTenderPrice', 'AqDeltaPrice'];
	private fieldAdjustment = ['Urb1Adjustment', 'Urb2Adjustment', 'Urb3Adjustment', 'Urb4Adjustment', 'Urb5Adjustment', 'Urb6Adjustment', 'WqAdjustmentPrice', 'AqAdjustmentPrice', 'UrAdjustment'];
	private fieldDelta = ['Urb1Delta', 'Urb2Delta', 'Urb3Delta', 'Urb4Delta', 'Urb5Delta', 'Urb6Delta', 'WqDeltaPrice', 'AqDeltaPrice', 'UrDelta'];

	private isWqField() {
		return this.fieldWq.includes(this.field);
	}

	private isAqField() {
		return this.fieldAq.includes(this.field);
	}

	private isAdjustmentField() {
		return this.fieldAdjustment.includes(this.field);
	}

	private isDeltaField() {
		return this.fieldDelta.includes(this.field);
	}

	private adjustment() {
		if (this.isWqField()) {
			this.item.UrAdjustment = this.item.WqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.WqAdjustmentPrice, this.item.WqQuantity), this.item.Factor) : 0;
		} else if (this.isAqField()) {
			this.item.UrAdjustment = this.item.AqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.AqAdjustmentPrice, this.item.AqQuantity), this.item.Factor) : 0;
		}
		if (this.item.IsUrb) {
			this.calUrb1N6(this.urb1N6Adjustment);
			this.item.UrAdjustment = this.isExistUrb ? this.returnTempValue() : this.item.UrAdjustment;
			this.resetValue();
		} else {
			this.clearUrb();
		}
		this.item.UrAdjustment = this.isNotEmpty ? this.item.UrAdjustment : null;
		this.item.UrTender = this.isNotEmpty ? this.item.UrAdjustment : null;
		this.item.UrDelta = this.isNotEmpty ? this.safeOperation('-', this.item.UrTender, this.item.UrEstimated) : null;
	}

	private tender() {
		if (this.isWqField()) {
			this.item.UrTender = this.item.WqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.WqTenderPrice, this.item.WqQuantity), this.item.Factor) : 0;
		} else if (this.isAqField()) {
			this.item.UrTender = this.item.AqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.AqTenderPrice, this.item.AqQuantity), this.item.Factor) : 0;
		}
		if (this.item.IsUrb) {
			this.calUrb1N6(this.urb1N6Tender);
			this.item.UrTender = this.isExistUrb ? this.returnTempValue() : this.item.UrTender;
			this.resetValue();
		} else {
			this.clearUrb();
		}

		this.item.UrTender = this.isNotEmpty ? this.item.UrTender : null;
		this.item.UrDelta = this.isNotEmpty ? this.safeOperation('-', this.item.UrTender, this.item.UrEstimated) : this.item.UrAdjustment !== null ? this.safeOperation('-', this.item.UrAdjustment, this.item.UrEstimated) : null;
	}

	private delta() {
		if (this.isWqField()) {
			this.item.WqTenderPrice = this.isNotEmpty ? this.safeOperation('+', this.item.WqDeltaPrice, this.item.WqEstimatedPrice) : this.item.WqEstimatedPrice;
			this.item.UrTender = this.item.WqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.WqTenderPrice, this.item.WqQuantity), this.item.Factor) : 0;
		} else if (this.isAqField()) {
			this.item.AqTenderPrice = this.isNotEmpty ? this.safeOperation('+', this.item.AqDeltaPrice, this.item.AqEstimatedPrice) : this.item.AqEstimatedPrice;
			this.item.UrTender = this.item.AqQuantity && this.item.Factor ? this.safeOperation('/', this.safeOperation('/', this.item.AqTenderPrice, this.item.AqQuantity), this.item.Factor) : 0;
		} else {
			this.item.UrTender = this.isNotEmpty ? this.safeOperation('+', this.item.UrDelta, this.item.UrEstimated) : this.item.UrEstimated;
		}
		if (this.item.IsUrb) {
			this.calUrb1N6(this.urb1N6Delta);
			this.item.UrTender = this.isExistUrb ? this.returnTempValue(true) : this.item.UrTender;
		} else {
			this.clearUrb();
		}
		this.item.UrDelta = this.safeOperation('-', this.item.UrTender, this.item.UrEstimated);
		if (this.changeAdjustment) {
			this.item.UrAdjustment = this.item.UrTender !== null ? this.item.UrTender : null;
		}
	}

	private urbAdjustment() {
		this.calUrb1N6(this.urbAdjustment1);
		this.item.UrAdjustment = this.returnTempValue();

		this.item.UrAdjustment = this.isNotEmpty ? this.item.UrAdjustment : null;
		if (this.item.IsUrb) {
			this.item.UrTender = this.isNotEmpty ? this.item.UrAdjustment : null;
		} else {
			this.item.UrTender = this.returnTemp2Value();
		}
		this.item.UrDelta = this.isNotEmpty ? this.safeOperation('-', this.item.UrTender, this.item.UrEstimated) : null;
	}

	private urbTender() {
		this.calUrb1N6(this.urbTender1);
		this.item.UrTender = this.returnTempValue();

		this.item.UrTender = this.isNotEmpty ? this.item.UrTender : null;
		this.item.UrDelta = this.isNotEmpty ? this.safeOperation('-', this.item.UrTender, this.item.UrEstimated) : this.item.UrAdjustment !== null ? this.safeOperation('-', this.item.UrAdjustment, this.item.UrEstimated) : null;
	}

	private urbDelta() {
		this.calUrb1N6(this.urbDelta1);
		this.item.UrTender = this.returnTempValue(true);
		this.item.UrDelta = this.safeOperation('-', this.item.UrTender, this.item.UrEstimated);
		if (this.changeAdjustment) {
			this.item.UrAdjustment = this.item.UrTender;
		}
	}

	private calWq() {
		this.item.WqAdjustmentPrice = this.item.UrAdjustment !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrAdjustment, this.item.WqQuantity), this.item.Factor) : null;
		this.item.WqTenderPrice = this.item.UrTender !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrTender, this.item.WqQuantity), this.item.Factor) : null;
		this.item.WqDeltaPrice = this.item.UrDelta !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrDelta, this.item.WqQuantity), this.item.Factor) : null;
	}

	private calAq(calEstimate?: boolean) {
		if (calEstimate) {
			this.item.AqEstimatedPrice = this.item.UrEstimated !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrEstimated, this.item.AqQuantity), this.item.Factor) : null;
		}
		this.item.AqAdjustmentPrice = this.item.UrAdjustment !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrAdjustment, this.item.AqQuantity), this.item.Factor) : null;
		this.item.AqTenderPrice = this.item.UrTender !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrTender, this.item.AqQuantity), this.item.Factor) : null;
		this.item.AqDeltaPrice = this.item.UrDelta !== null ? this.safeOperation('*', this.safeOperation('*', this.item.UrDelta, this.item.AqQuantity), this.item.Factor) : null;
	}

	private getValue(key: string): number | null {
		return get(this.item, key);
	}

	private setValue(key: string, value: number | null) {
		set(this.item, key, value!);
	}

	private urb1N6Adjustment(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const urbAdjustment = this.getValue(urbPrice.Adjustment);
		const urbTender = this.getValue(urbPrice.Tender);
		const urbDelta = this.getValue(urbPrice.Delta);
		const rate = this.getUrbRate(urbPrice);
		if (urbEstimated !== null) {
			const urbAdjustmentNew = this.isNotEmpty ? this.safeOperation('+', rate, this.item.UrAdjustment) : null;
			this.setValue(urbPrice.Adjustment, urbAdjustmentNew);
			const urbTenderNew = this.isNotEmpty ? urbAdjustment : null;
			this.setValue(urbPrice.Tender, urbTenderNew);
			const urbDeltaNew = this.isNotEmpty ? this.safeOperation('-', urbTender, urbDelta) : null;
			this.setValue(urbPrice.Delta, urbDeltaNew);
			this.tempValue = this.safeOperation('+', this.tempValue, urbAdjustmentNew);
		}
	}

	private urb1N6Tender(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const urbAdjustment = this.getValue(urbPrice.Adjustment);
		const urbTender = this.getValue(urbPrice.Tender);
		const rate = this.getUrbRate(urbPrice);
		if (urbEstimated !== null || urbAdjustment !== null) {
			const urbTenderNew = this.isNotEmpty ? this.safeOperation('*', rate, this.item.UrTender) : null;
			this.setValue(urbPrice.Tender, urbTenderNew);
			const urbDeltaNew = this.isNotEmpty ? this.safeOperation('-', urbTender, urbEstimated) : urbAdjustment !== null ? this.safeOperation('-', urbAdjustment, urbEstimated) : null;
			this.setValue(urbPrice.Delta, urbDeltaNew);
			this.tempValue = this.safeOperation('+', this.tempValue, urbTenderNew);
		}
	}

	private urb1N6Delta(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const rate = this.getUrbRate(urbPrice);
		if (urbEstimated !== null) {
			const urbTenderNew = this.item.UrTender !== null ? this.safeOperation('*', rate, this.item.UrTender) : null;
			this.setValue(urbPrice.Tender, urbTenderNew);
			if (this.changeAdjustment) {
				this.setValue(urbPrice.Adjustment, urbTenderNew);
			}
			const urbDeltaNew = this.safeOperation('-', urbTenderNew, urbEstimated);
			this.setValue(urbPrice.Delta, urbDeltaNew);
			this.tempValue = this.safeOperation('+', this.tempValue, urbTenderNew);
		}
	}

	private urbAdjustment1(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		let urbAdjustment = this.getValue(urbPrice.Adjustment);
		const urbTender = this.getValue(urbPrice.Tender);
		this.getValue(urbPrice.Delta);
		if (urbEstimated !== null || (!this.item.IsUrb && (urbPrice.Num === this.price.Num || (urbPrice.Num !== this.price.Num && (urbAdjustment !== null || urbTender !== null))))) {
			if (urbPrice.Num !== this.price.Num) {
				const urbAdjustmentNew = this.isNotEmpty ? (urbAdjustment === null ? urbEstimated : urbAdjustment) : null;
				this.setValue(urbPrice.Adjustment, urbAdjustmentNew);
			}
			urbAdjustment = this.getValue(urbPrice.Adjustment);
			const urbTenderNew = this.isNotEmpty ? (urbAdjustment !== null ? urbAdjustment : urbTender) : null;
			this.setValue(urbPrice.Tender, urbTenderNew);
			const urbDeltaNew = this.isNotEmpty ? this.safeOperation('-', urbTenderNew, urbEstimated) : null;
			this.setValue(urbPrice.Delta, urbDeltaNew);
			this.tempValue = this.safeOperation('+', this.tempValue, urbAdjustment);
			this.temp2Value = this.safeOperation('+', this.temp2Value, urbTenderNew);
		}
	}

	private urbTender1(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const urbAdjustment = this.getValue(urbPrice.Adjustment);
		let urbTender = this.getValue(urbPrice.Tender);
		const urbDelta = this.getValue(urbPrice.Delta);
		if (urbEstimated !== null || (!this.item.IsUrb && (urbPrice.Num === this.price.Num || (urbPrice.Num !== this.price.Num && urbTender !== null)))) {
			if (urbPrice.Num !== this.price.Num) {
				const urbTenderNew = this.isNotEmpty ? (urbTender === null ? (urbEstimated === null ? urbDelta : urbEstimated) : urbTender) : null;
				this.setValue(urbPrice.Tender, urbTenderNew);
			}
			urbTender = this.getValue(urbPrice.Tender);
			const urbDeltaNew = this.isNotEmpty ? this.safeOperation('-', urbTender, urbEstimated) : urbAdjustment !== null ? this.safeOperation('-', urbAdjustment, urbEstimated) : null;
			this.setValue(urbPrice.Delta, urbDeltaNew);
			this.tempValue = this.safeOperation('+', this.tempValue, urbTender);
		}
	}

	private urbDelta1(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const urbAdjustment = this.getValue(urbPrice.Adjustment);
		let urbTender = this.getValue(urbPrice.Tender);
		let urbDelta = this.getValue(urbPrice.Delta);

		if (urbEstimated !== null || (!this.item.IsUrb && (urbPrice.Num === this.price.Num || (urbPrice.Num !== this.price.Num && urbDelta !== null)))) {
			let isChangeAdjust = false;
			if (urbAdjustment === null && urbTender === null) {
				isChangeAdjust = true;
			}
			if (urbPrice.Num === this.price.Num) {
				const urbTenderNew = this.isNotEmpty ? this.safeOperation('+', urbDelta, urbEstimated) : urbEstimated !== null ? urbEstimated : 0;
				this.setValue(urbPrice.Tender, urbTenderNew);
				const urbDeltaNew = this.isNotEmpty ? urbDelta : 0;
				this.setValue(urbPrice.Delta, urbDeltaNew);
			} else {
				const urbTenderNew = urbTender !== null ? urbTender : urbAdjustment !== null ? this.safeOperation('-', urbAdjustment, urbEstimated) : urbEstimated !== null ? urbEstimated : urbDelta;
				this.setValue(urbPrice.Tender, urbTenderNew);
				const urbDeltaNew = this.safeOperation('-', urbTenderNew, urbEstimated);
				this.setValue(urbPrice.Delta, urbDeltaNew);
			}
			urbTender = this.getValue(urbPrice.Tender);
			urbDelta = this.getValue(urbPrice.Delta);
			if (this.changeAdjustment && isChangeAdjust && urbDelta !== null) {
				const urbAdjustmentNew = urbTender;
				this.setValue(urbPrice.Adjustment, urbAdjustmentNew);
				if (urbAdjustmentNew && this.item.UrAdjustment) {
					this.item.UrAdjustment += urbAdjustmentNew;
				}
			}

			const tenderValue = this.getValue(urbPrice.Tender);
			if (tenderValue) {
				this.tempValue = (this.tempValue || 0) + tenderValue;
			}
		}
	}

	private calUrb1N6(callback: (key: Price) => void) {
		this.tempValue = null;
		forEach([1, 2, 3, 4, 5, 6], (k) => {
			const urb = 'Urb' + k;
			if (!this.unCalUrbs.includes(urb)) {
				const urbPrice: Price = {
					Estimated: urb + this.price.Estimated,
					Adjustment: urb + this.price.Adjustment,
					Tender: urb + this.price.Tender,
					Delta: urb + this.price.Delta,
					Num: k,
				};
				this.isExistUrb = true;
				callback.call(this, urbPrice);
			}
		});
	}

	private clearUrb() {
		this.calUrb1N6((urbPrice: Price) => {
			this.setValue(urbPrice.Adjustment, null);
			this.setValue(urbPrice.Tender, null);
			this.setValue(urbPrice.Delta, null);
		});
	}

	private getUrbRate(urbPrice: Price) {
		const urbEstimated = this.getValue(urbPrice.Estimated);
		const urbAdjustment = this.getValue(urbPrice.Adjustment);
		if (this.isAdjustmentField() && this.item.UrEstimated && urbEstimated) {
			return urbEstimated / this.item.UrEstimated;
		} else if (this.item.UrAdjustment && urbAdjustment) {
			return urbAdjustment / this.item.UrAdjustment!;
		} else if (this.item.UrEstimated && urbEstimated) {
			return urbEstimated / this.item.UrEstimated!;
		}
		return 0;
	}

	private calculate() {
		switch (this.field) {
			case 'AqAdjustmentPrice':
			case 'WqAdjustmentPrice':
			case 'UrAdjustment':
				this.adjustment();
				break;
			case 'AqTenderPrice':
			case 'WqTenderPrice':
			case 'UrTender':
				this.tender();
				break;
			case 'AqDeltaPrice':
			case 'WqDeltaPrice':
			case 'UrDelta':
				this.delta();
				break;
			case 'Urb1Adjustment':
			case 'Urb2Adjustment':
			case 'Urb3Adjustment':
			case 'Urb4Adjustment':
			case 'Urb5Adjustment':
			case 'Urb6Adjustment':
				this.urbAdjustment();
				break;
			case 'Urb1Tender':
			case 'Urb2Tender':
			case 'Urb3Tender':
			case 'Urb4Tender':
			case 'Urb5Tender':
			case 'Urb6Tender':
				this.urbTender();
				break;
			case 'Urb1Delta':
			case 'Urb2Delta':
			case 'Urb3Delta':
			case 'Urb4Delta':
			case 'Urb5Delta':
			case 'Urb6Delta':
				this.urbDelta();
				break;
			case 'AqQuantity':
				this.calAq(true);
				break;
			default:
				break;
		}

		this.calWq();
		this.calAq();

		this.calculateValue = this.getValue(this.field)!;

		if (this.isDeltaField()) {
			if (!this.isNotEmpty) {
				this.calculateValue = 0;
			}
			this.resetValue();
		}
		this.resetSpecialValue();
	}

	private isNotEmptyOrNull(v: number | null | string) {
		return v !== null && v !== '';
	}

	private returnTempValue(isTmpValue?: boolean): number | null {
		return this.isNotEmpty || isTmpValue ? (this.tempValue === null ? 0 : this.tempValue) : null;
	}

	private returnTemp2Value() {
		return this.isNotEmpty ? (this.temp2Value === null ? 0 : this.temp2Value) : null;
	}

	private resetValue() {
		setTimeout(() => {
			this.setValue(this.field, this.calculateValue);
			this.restSpecialItem(this.item);
			//estimateMainPriceAdjustmentDataService.gridRefresh();
		});
	}

	private resetSpecialValue() {
		setTimeout(() => {
			this.restSpecialItem(this.item);
			//estimateMainPriceAdjustmentDataService.gridRefresh();
		});
	}

	private isQuantityEqualZero() {
		let isQuantityEqualZero = false;
		if (this.isWqField()) {
			isQuantityEqualZero = this.item.WqQuantity === 0;
		} else if (this.isAqField()) {
			if (this.field !== 'AqQuantity') {
				isQuantityEqualZero = this.item.AqQuantity === 0;
			}
		}
		if (isQuantityEqualZero) {
			this.setValue(this.field, this.changeAdjustment ? null : 0);
			this.calculateValue = this.getValue(this.field)!;
		}
		return isQuantityEqualZero;
	}

	public restSpecialItem(item: IEstPriceAdjustmentItemData) {
		// let specialFields = ['UrDelta', 'UrAdjustment', 'UrTender', 'WqDeltaPrice', 'AqDeltaPrice'];
		//if (estimateMainPriceAdjustmentDataService.hasSpecialReadOnly(item)) {
		item.WqDeltaPrice = item.WqDeltaPrice !== null ? 0 : null;
		item.WqAdjustmentPrice = item.WqAdjustmentPrice !== null ? 0 : null;
		item.WqTenderPrice = item.WqTenderPrice !== null ? 0 : null;
		item.AqDeltaPrice = item.AqDeltaPrice !== null ? 0 : null;
		item.AqAdjustmentPrice = item.AqAdjustmentPrice !== null ? 0 : null;
		item.AqTenderPrice = item.AqTenderPrice !== null ? 0 : null;
		//}
	}
}
