/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcItemEntity } from '../../model/entities';
import { BasItemType, BasItemType2 } from '@libs/basics/shared';
import { ProcurementCommonItemCalculationService, TotalGrossField } from './procurement-common-item-calculation.service';

/**
 * Procurement PrcItem calculation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPrcItemCalculationService extends ProcurementCommonItemCalculationService<IPrcItemEntity> {
	public override readonly roundingType = this.getRoundingType<IPrcItemEntity>();

	private isOptionalItem(item: IPrcItemEntity): boolean {
		return item.BasItemTypeFk === BasItemType.OptionalWithoutIT;
	}

	private isNonAwardedAlternativeWithinAlternativeGroupItem(item: IPrcItemEntity): boolean {
		return item.BasItemType2Fk === BasItemType2.BasePostponed || item.BasItemType2Fk === BasItemType2.Alternative;
	}

	private isOptionalOrAlternativeItem(item: IPrcItemEntity): boolean {
		return this.isOptionalItem(item) || this.isNonAwardedAlternativeWithinAlternativeGroupItem(item);
	}

	public getTotalNoDiscount(item: IPrcItemEntity, vatPercent: number): number {
		return (item.Discount === 0 && item.DiscountSplit === 0) ?
			item.Total :
			(!this.isOverGross ?
					this.round(this.roundingType.TotalNoDiscount, this.formula.totalNoDiscountByPrice(item.Price, item.PriceExtra, item.Quantity, item.PriceUnit, item.FactorPriceUnit)) :
					this.getTotalNoDiscountByTotalGross(item, vatPercent)
			);
	}

	public getTotalOcNoDiscount(item: IPrcItemEntity, vatPercent: number): number {
		return (item.Discount === 0 && item.DiscountSplitOc === 0) ?
			item.TotalOc :
			(!this.isOverGross ?
					this.round(this.roundingType.TotalCurrencyNoDiscount, this.formula.totalNoDiscountByPrice(item.PriceOc, item.PriceExtraOc, item.Quantity, item.PriceUnit, item.FactorPriceUnit)) :
					this.getTotalOcNoDiscountByTotalGrossOc(item, vatPercent)
			);
	}

	public getTotalNoDiscountByTotalGross(item: IPrcItemEntity, vatPercent: number): number {
		let result;
		if (item.Discount === 100) {
			const price = this.formula.preTaxValueByAfterTax(item.PriceGross, vatPercent);
			result = this.formula.totalNoDiscountByPrice(price, item.PriceExtra, item.Quantity, item.PriceUnit, item.FactorPriceUnit);
		} else {
			const discountTotalGross = this.formula.discountTotal(item.DiscountAbsolute, item.Quantity, item.PriceUnit, item.FactorPriceUnit);
			const totalNoDiscountGross = this.formula.totalNoDiscountByTotal(item.TotalGross, item.DiscountSplit, discountTotalGross);
			result = this.formula.preTaxValueByAfterTax(totalNoDiscountGross, vatPercent);
		}
		return this.round(this.roundingType.TotalNoDiscount, result);
	}

	public getTotalOcNoDiscountByTotalGrossOc(item: IPrcItemEntity, vatPercent: number): number {
		let result;
		if (item.Discount === 100) {
			const priceOc = this.formula.preTaxValueByAfterTax(item.PriceGrossOc, vatPercent);
			result = this.formula.totalNoDiscountByPrice(priceOc, item.PriceExtraOc, item.Quantity, item.PriceUnit, item.FactorPriceUnit);
		} else {
			const discountTotalGrossOc = this.formula.discountTotal(item.DiscountAbsoluteOc, item.Quantity, item.PriceUnit, item.FactorPriceUnit);
			const totalOcNoDiscountGross = this.formula.totalNoDiscountByTotal(item.TotalGrossOc, item.DiscountSplitOc, discountTotalGrossOc);
			result = this.formula.preTaxValueByAfterTax(totalOcNoDiscountGross, vatPercent);
		}
		return this.round(this.roundingType.TotalCurrencyNoDiscount, result);
	}

	public override calculateAfterVatPercentChanged(item: IPrcItemEntity, vatPercent: number, exchangeRate: number) {
		super.calculateAfterVatPercentChanged(item, vatPercent, exchangeRate, item.PriceUnit, item.FactorPriceUnit);

		if (!this.isOverGross) {
			item.DiscountAbsoluteGross = this.getDiscountAbsoluteGrossByDA(item, vatPercent);
			item.DiscountAbsoluteGrossOc = this.getDiscountAbsoluteGrossOcByOc(item, vatPercent);
		} else {
			item.DiscountAbsolute = this.getDiscountAbsoluteByGross(item, vatPercent);
			item.DiscountAbsoluteOc = this.getDiscountAbsoluteOcByGrossOc(item, vatPercent);
		}
	}

	/**
	 * Calculate totalPrice and total fields
	 * TotalPriceOc, TotalPrice, TotalPriceGrossOc, TotalPriceGross
	 * TotalOc, Total, TotalGrossOc, TotalGross, TotalCurrencyNoDiscount, TotalNoDiscount
	 * @param item
	 * @param vatPercent
	 * @param exchangeRate
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @param onlyCalculateTotal
	 */
	public override calculateTotalPriceNTotal(item: IPrcItemEntity, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number, onlyCalculateTotal: boolean = false) {
		super.calculateTotalPriceNTotal(item, vatPercent, exchangeRate, priceUnit, factorPriceUnit, onlyCalculateTotal);
		this.setTotalZeroIfItemTypeIsOptionalOrAlternativeItem(item);
	}

	/**
	 * Calculate TotalOc, Total, TotalCurrencyNoDiscount and TotalNoDiscount
	 * TotalOc/Total: gross mode by:TotalGrossOc/TotalGross, net mode by:TotalPriceOc/TotalPrice
	 * TotalCurrencyNoDiscount/TotalNoDiscount: gross mode by:TotalGrossOc/TotalGross, net mode by:PriceOc/Price
	 * @param item
	 * @param vatPercent
	 * @private
	 */
	public override calculateTotalNet(item: IPrcItemEntity, vatPercent: number) {
		super.calculateTotalNet(item, vatPercent, item.PriceUnit, item.FactorPriceUnit);
		this.calculateTotalNoDiscountFields(item, vatPercent);
	}

	public override calculateAfterInputTotalGross(item: IPrcItemEntity, value: number, inputField: TotalGrossField, vatPercent: number, exchangeRate: number) {
		super.calculateAfterInputTotalGross(item, value, inputField, vatPercent, exchangeRate, item.PriceUnit, item.FactorPriceUnit);
		this.calculateTotalNoDiscountFields(item, vatPercent);
	}

	public calculateTotalNoDiscountFields(item: IPrcItemEntity, vatPercent: number) {
		item.TotalCurrencyNoDiscount = this.getTotalOcNoDiscount(item, vatPercent);
		item.TotalNoDiscount = this.getTotalNoDiscount(item, vatPercent);
	}

	/**
	 * Set total fields zero
	 * when BasItemTypeFk === BasItemType.OptionalWithoutIT or item.BasItemType2Fk === BasItemType2.BasePostponed or item.BasItemType2Fk === BasItemType2.Alternative
	 * @param item
	 */
	private setTotalZeroIfItemTypeIsOptionalOrAlternativeItem(item: IPrcItemEntity) {
		if (this.isOptionalOrAlternativeItem(item)) {
			item.Total = 0;
			item.TotalOc = 0;
			item.TotalNoDiscount = 0;
			item.TotalCurrencyNoDiscount = 0;
			item.TotalGross = 0;
			item.TotalGrossOc = 0;
			return true;
		} else {
			return false;
		}
	}
}