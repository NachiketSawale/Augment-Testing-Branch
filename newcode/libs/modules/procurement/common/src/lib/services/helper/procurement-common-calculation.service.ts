/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BigNumber, bignumber } from 'mathjs';
import { PlatformTranslateService } from '@libs/platform/common';
import {
	BasicsSharedRoundingConstants,
	BasicsSharedCalculateOverGrossService,
	BasicsSharedDecimalPlacesEnum as decimalPlacesEnum
} from '@libs/basics/shared';
import { ProcurementCommonRoundingService } from './procurement-common-rounding.service';
import { ProcurementRoundingMethod } from '../../model/enums';

/**
 * Prc common calculate service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonCalculationService {
	protected readonly translate = inject(PlatformTranslateService);
	protected readonly roundingService = inject(ProcurementCommonRoundingService);
	protected readonly overGrossService = inject(BasicsSharedCalculateOverGrossService);
	protected readonly baseRoundingType = BasicsSharedRoundingConstants.configDetailType;
	protected readonly isOverGross = this.overGrossService.isOverGross;

	protected getBasePriceVatRate(vatPercent: number): number {
		return bignumber(100).add(vatPercent).div(100).toNumber();
	}
	protected getDiscountRate(discount: number): number {
		return bignumber(100).sub(discount).div(100).toNumber();
	}
	protected checkDivisorIsZero(divisor: number, name: string) {
		if (divisor === 0) {
			throw new Error(this.translate.instant({
				key: 'procurement.common.divisorCannotBeZero',
				params: {name: name}}).text
			);
		}
	}
	protected checkPriceUnitIsZero(priceUnit: number) {
		this.checkDivisorIsZero(priceUnit, 'priceUnit');
	}
	protected checkFactorPriceUnitIsZero(factorPriceUnit: number) {
		this.checkDivisorIsZero(factorPriceUnit, 'FactorPriceUnit');
	}
	protected checkQuantityIsZero(quantity: number) {
		this.checkDivisorIsZero(quantity, 'Quantity');
	}
	protected checkExchangeRateIsZero(rate: number) {
		this.checkDivisorIsZero(rate, 'ExchangeRate');
	}
	public readonly formula = {
		// Total
		totalByTotalPrice: (totalPrice: numberNBigNumber, quantity: number, priceUnit: number, factorPriceUnit: number, discountSplit: number): BigNumber => {
			this.checkPriceUnitIsZero(priceUnit);
			return bignumber(totalPrice).mul(quantity).div(priceUnit).mul(factorPriceUnit).sub(discountSplit);
		},
		totalByPrice: (price: number, priceExtra: numberNBigNumber, discountAbsolute: number, quantity: number, priceUnit: number, factorPriceUnit: number, discountSplit: number): BigNumber => {
			const totalPrice = this.formula.totalPrice(price, priceExtra, discountAbsolute);
			return this.formula.totalByTotalPrice(totalPrice, quantity, priceUnit, factorPriceUnit, discountSplit);
		},
		// TotalNoDiscount
		totalNoDiscountByPrice: (price: numberNBigNumber, priceExtra: number, quantity: number, priceUnit: number, factorPriceUnit: number): BigNumber => {
			this.checkPriceUnitIsZero(priceUnit);
			return bignumber(price).add(priceExtra).mul(quantity).div(priceUnit).mul(factorPriceUnit);
		},
		totalNoDiscountByTotal: (total: number, discountSplit: number, discountTotal: numberNBigNumber): BigNumber => {
			return bignumber(total).add(discountSplit).add(discountTotal);
		},
		// TotalPrice
		totalPrice: (price: number, priceExtra: numberNBigNumber, discountAbsolute: number): BigNumber => {
			return bignumber(price).add(priceExtra).sub(discountAbsolute);
		},
		totalPriceByDiscount: (price: number, priceExtra: numberNBigNumber, discount: number): BigNumber => {
			const discountRate = this.getDiscountRate(discount);
			return bignumber(price).add(priceExtra).mul(discountRate);
		},
		totalPriceByTotal: (total: number, discountSplit: number, quantity: number, priceUnit: number, factorPriceUnit: number): BigNumber => {
			this.checkFactorPriceUnitIsZero(factorPriceUnit);
			this.checkQuantityIsZero(quantity);
			return bignumber(total).add(discountSplit).div(quantity).mul(priceUnit).div(factorPriceUnit);
		},
		// TotalPriceNoDiscount
		totalPriceNoDiscount: (price: number, priceExtra: number) => {
			return bignumber(price).add(priceExtra);
		},
		// DiscountAbsolute
		discountAbsolute: (price: number, priceExtra: numberNBigNumber, discount: number) => {
			return bignumber(price).add(priceExtra).mul(discount).div(100);
		},
		discount: (totalPriceNoDiscount: number, discountAbsoluteOc: number) => {
			return bignumber(discountAbsoluteOc).div(totalPriceNoDiscount).mul(100);
		},
		// Price
		priceByTotal: (total: numberNBigNumber, quantity: number, priceExtra: number, discount: number, priceUnit: number, factorPriceUnit: number, discountSplit: number): BigNumber => {
			const discountRate = this.getDiscountRate(discount);
			this.checkFactorPriceUnitIsZero(factorPriceUnit);
			return (quantity !== 0) ?
				bignumber(total).add(discountSplit).div(factorPriceUnit).mul(priceUnit).div(quantity).div(discountRate).sub(priceExtra) :
				bignumber(0);
		},
		priceByTotalPrice: (totalPrice: number, priceExtra: numberNBigNumber, discountAbsolute: number) => {
			return bignumber(totalPrice).add(discountAbsolute).sub(priceExtra);
		},
		priceByTotalNoDiscount: (totalNoDiscount: number, quantity: number, priceExtra: number, priceUnit: number, factorPriceUnit: number) => {
			this.checkFactorPriceUnitIsZero(factorPriceUnit);
			return (quantity !== 0) ?
				bignumber(totalNoDiscount).div(factorPriceUnit).mul(priceUnit).div(quantity).sub(priceExtra) :
				bignumber(0);
		},
		priceByCost: (cost: number, priceExtra: number) => {
			return bignumber(cost).sub(priceExtra);
		},
		priceOcByCost: (cost: number, priceExtra: number, rate: number) => {
			this.checkExchangeRateIsZero(rate);
			return bignumber(cost).sub(priceExtra).div(rate);
		},
		// FactoredTotalPrice
		factoredTotalPrice: (price: number, priceExtra: numberNBigNumber, discountAbsolute: number, priceUnit: number) => {
			return bignumber(price).add(priceExtra).sub(discountAbsolute).div(priceUnit);
		},
		// Other
		preTaxValueByAfterTax: (afterTaxValue: numberNBigNumber, vatPercent: number): BigNumber => {
			return bignumber(afterTaxValue).div(this.getBasePriceVatRate(vatPercent));
		},
		afterTaxValueByPreTax: (preTaxValue: numberNBigNumber, vatPercent: number): BigNumber => {
			return bignumber(preTaxValue).mul(this.getBasePriceVatRate(vatPercent));
		},
		homeCurrencyByOther: (otherCurrencyValue: numberNBigNumber, exchangeRate: number): BigNumber => {
			this.checkExchangeRateIsZero(exchangeRate);
			return bignumber(otherCurrencyValue).div(exchangeRate);
		},
		otherCurrencyByHome: (homeCurrencyValue: number, exchangeRate: number): BigNumber => {
			return bignumber(homeCurrencyValue).mul(exchangeRate);
		},
		discountTotal: (discountAbsolute: number, quantity: number, priceUnit: number, factorPriceUnit: number): BigNumber => {
			this.checkPriceUnitIsZero(priceUnit);
			return bignumber(discountAbsolute).mul(quantity).div(priceUnit).mul(factorPriceUnit);
		}
	};

	/**
	 * Whether currency parity
	 * @param exchangeRate
	 */
	public isCurrencyParity(exchangeRate: number): boolean {
		return exchangeRate === 1;
	}

	/**
	 * Whether is no tax
	 * @param vatPercent
	 */
	public isNoTax(vatPercent: number): boolean {
		return vatPercent === 0;
	}

	/**
	 * Get rounding type
	 */
	public getRoundingType<T>() {
		return this.roundingService.getRoundingType<T>();
	}

	/**
	 * Do round with rounding type
	 * @param roundingField
	 * @param beforeRoundingValue
	 * @param method
	 */
	public round(roundingField: number, beforeRoundingValue: numberNBigNumber, method?: ProcurementRoundingMethod): number {
		return this.roundingService.round(roundingField, beforeRoundingValue, method);
	}

	/**
	 * Do round to pointed decimalPlace, default to 2 decimalPlace
	 * @param value
	 * @param decimalPlace
	 */
	public roundTo(value: numberNBigNumber, decimalPlace?: decimalPlacesEnum): number {
		return this.roundingService.roundTo(value, decimalPlace);
	}

	/**
	 * calculates the pre-tax value given an after-tax value and a VAT percentage
	 * method name is getPreTaxByAfterTax in angularJs
	 * @param afterTaxValue
	 * @param vatPercent
	 * @param decimalPlace
	 */
	public getPreTaxValueByAfterTaxValue(afterTaxValue: number, vatPercent: number, decimalPlace?: decimalPlacesEnum): number {
		return this.roundingService.roundTo(this.formula.preTaxValueByAfterTax(afterTaxValue, vatPercent), decimalPlace);
	}

	/**
	 * calculates the after-tax value given a pre-tax value and a VAT percentage
	 * method name is getAfterTaxByPreTax in angularJs
	 * @param preTaxValue
	 * @param vatPercent
	 * @param decimalPlace
	 */
	public getAfterTaxValueByPreTaxValue(preTaxValue: number, vatPercent: number, decimalPlace?: decimalPlacesEnum): number {
		return this.roundingService.roundTo(this.formula.afterTaxValueByPreTax(preTaxValue, vatPercent), decimalPlace);
	}

	/**
	 * calculates the OC value based on a home value and an exchange rate
	 * method name is getOcByNonOc in angularJs
	 * @param homeValue
	 * @param exchangeRate
	 * @param decimalPlace
	 */
	public getOcValueByHomeValue(homeValue: number, exchangeRate: number, decimalPlace?: decimalPlacesEnum): number {
		return this.roundingService.roundTo(this.formula.otherCurrencyByHome(homeValue, exchangeRate), decimalPlace);
	}

	/**
	 * calculates the home value based on an OC value and an exchange rate
	 * method name is getNonOcByOc in angularJs
	 * @param ocValue
	 * @param exchangeRate
	 * @param decimalPlace
	 */
	public getHomeValueByOcValue(ocValue: number, exchangeRate: number, decimalPlace?: decimalPlacesEnum): number {
		return this.roundingService.roundTo(this.formula.homeCurrencyByOther(ocValue, exchangeRate), decimalPlace);
	}
}

/**
 * type of number or BigNumber
 */
export type numberNBigNumber = number | BigNumber;