/*
 * Copyright(c) RIB Software GmbH
 */

import { bignumber } from 'mathjs';
import { Injectable } from '@angular/core';
import { IInv2ContractEntity } from '../model';
import { noRoundingType } from '@libs/basics/shared';
import {
	ProcurementCommonCalculationService,
	ProcurementRoundingMethod
} from '@libs/procurement/common';

/**
 * Procurement invoice contract item calculation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceContractItemCalculationService extends ProcurementCommonCalculationService {
	/**
	 * rounding type
	 */
	public readonly roundingType: Record<(keyof (IInv2ContractEntity & noRoundingType)), number>;

	/**
	 * The constructor
	 */
	public constructor() {
		super();
		this.roundingType = this.roundingService.getRoundingType<IInv2ContractEntity>();
	}

	/**
	 * Computes the pre-tax unit rate from an after-tax unit rate, using the specified VAT rate, rounding result by unitRate type.
	 * @param afterTax
	 * @param vatPercent
	 * @param method
	 */
	public getUnitRatePreTaxByAfterTax(afterTax: number, vatPercent: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.unitRate, this.formula.preTaxValueByAfterTax(afterTax, vatPercent), method);
	}

	/**
	 * Computes the after-tax unit rate from a pre-tax unit rate, using the specified VAT rate, rounding result by unitRate type.
	 * @param preTax
	 * @param vatPercent
	 * @param method
	 */
	public getUnitRateAfterTaxByPreTax(preTax: number, vatPercent: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.unitRate, this.formula.afterTaxValueByPreTax(preTax, vatPercent), method);
	}

	/**
	 * Computes the other currency value from a home currency value, using the provided exchange rate, rounding result by unitRate type.
	 * method name is getUnitRateOcByNonOc in angularJs
	 * @param homeValue
	 * @param exchangeRate
	 */
	public getUnitRateOcByHomeValue(homeValue: number, exchangeRate: number) {
		return this.roundingService.round(this.baseRoundingType.unitRate, this.formula.otherCurrencyByHome(homeValue, exchangeRate));
	}

	/**
	 * Computes the home currency value from another currency value, using the provided exchange rate, rounding result by unitRate type.
	 * method name is getUnitRateNonOcByOc in angularJs
	 * @param ocValue
	 * @param exchangeRate
	 * @param method
	 */
	public getUnitRateHomeValueByOc(ocValue: number, exchangeRate: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.unitRate, this.formula.homeCurrencyByOther(ocValue, exchangeRate), method);
	}

	/**
	 * Computes the after-tax value from a pre-tax value, using the specified VAT rate, rounding result by amount type.
	 * @param preTax
	 * @param vatPercent
	 * @param method
	 */
	public getAmountAfterTaxByPreTax(preTax: number, vatPercent: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.amounts, this.formula.afterTaxValueByPreTax(preTax, vatPercent), method);
	}

	/**
	 * Computes the per-tax value from an after-tax value, using the specified VAT rate, rounding result by amount type.
	 * @param preTax
	 * @param vatPercent
	 * @param method
	 */
	public getAmountPerTaxByAfterTax(preTax: number, vatPercent: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.amounts, this.formula.preTaxValueByAfterTax(preTax, vatPercent), method);
	}

	/**
	 * Computes the home currency value from another value, using the provided exchange rate, rounding result by amount type.
	 * method name is getAmountNonOcByOc in angularJs
	 * @param ocValue
	 * @param exchangeRate
	 * @param method
	 */
	public getAmountHomeValueByOc(ocValue: number, exchangeRate: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.amounts, this.formula.homeCurrencyByOther(ocValue, exchangeRate), method);
	}

	/**
	 * Computes the other currency value from a home value, using the provided exchange rate, rounding result by amount type.
	 * method name is getAmountOcByNonOc in angularJs
	 * @param homeValue
	 * @param exchangeRate
	 * @param method
	 */
	public getAmountOcByHomeValue(homeValue: number, exchangeRate: number, method?: ProcurementRoundingMethod) {
		return this.roundingService.round(this.baseRoundingType.amounts, this.formula.otherCurrencyByHome(homeValue, exchangeRate), method);
	}

	/**
	 * Computes percentage by quantity and orderQuantity
	 * method name is getPercentageForInv in angularJs
	 * @param quantity
	 * @param orderQuantity
	 * @param method
	 */
	public getPercentage(quantity: number, orderQuantity: number, method: ProcurementRoundingMethod) {
		return orderQuantity ?
			this.roundingService.round(this.roundingType.NoType, bignumber(quantity).div(orderQuantity).mul(100), method) :
			0;
	}

	/**
	 * Computes price
	 * method name is getPriceByTotalPriceForInv in angularJs
	 * @param totalPrice
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @param method
	 */
	public getPriceByTotalPrice(totalPrice: number, priceUnit: number, factorPriceUnit: number, method?: ProcurementRoundingMethod) {
		return priceUnit ?
			this.roundingService.round(this.roundingType.Price, bignumber(totalPrice).div(priceUnit).mul(factorPriceUnit), method) :
			0;

	}

	/**
	 * method name is getTotalGrossForInv in angularJs
	 */
	public getTotalGross(price: number, quantity: number, priceExtra: number, discount: number, vatPercent: number, priceUnit: number, factorPriceUnit: number, discountSplit: number, totalGrossOc: number, exchangeRate: number, method?: ProcurementRoundingMethod) {
		if (!this.isOverGross) {
			const totalPrice = this.formula.totalPriceByDiscount(price, priceExtra, discount);
			const netTotal = this.formula.totalByTotalPrice(totalPrice, quantity, priceUnit, factorPriceUnit, discountSplit);
			const vat = bignumber(netTotal).mul(vatPercent).div(100);
			return this.roundingService.round(this.baseRoundingType.amounts, bignumber(netTotal).add(vat), method);
		} else {
			return (this.isCurrencyParity(exchangeRate)) ?
				totalGrossOc :
				this.getAmountHomeValueByOc(totalGrossOc, exchangeRate);
		}
	}

	/**
	 * method name is getTotalGrossOcForInv in angularJs
	 */
	public getTotalGrossOc(priceOc: number, quantity: number, priceExtraOc: number, discount: number, vatPercent: number, priceUnit: number, factorPriceUnit: number, discountSplitOc: number, method?: ProcurementRoundingMethod) {
		const totalPriceOc = this.formula.totalPriceByDiscount(priceOc, priceExtraOc, discount);
		const netTotalOc = this.formula.totalByTotalPrice(totalPriceOc, quantity, priceUnit, factorPriceUnit, discountSplitOc);
		const vatOc = bignumber(netTotalOc).mul(vatPercent).div(100);
		return this.roundingService.round(this.baseRoundingType.amounts, bignumber(netTotalOc).add(vatOc), method);
	}

	/**
	 * method name is getTotalValueForInv in angularJs
	 */
	public getTotalValue(item: IInv2ContractEntity, vatPercent: number, method?: ProcurementRoundingMethod) {
		if (!this.isOverGross) {
			const discountSplit = item.PrcItemFk ? item.DiscountSplit : 0;
			return this.roundingService.round(this.roundingType.TotalValue, bignumber(item.Quantity ?? 0).mul(item.Price ?? 0).sub(discountSplit), method);
		} else {
			return this.isNoTax(vatPercent) ?
				item.TotalValueGross :
				this.getAmountPerTaxByAfterTax(item.TotalValueGross, vatPercent, method);
		}
	}

	/**
	 * method name is getTotalValueOcForInv in angularJs
	 */
	public getTotalValueOc(item: IInv2ContractEntity, vatPercent: number, method?: ProcurementRoundingMethod) {
		if (!this.isOverGross) {
			const discountSplitOc = item.PrcItemFk ? item.DiscountSplitOc : 0;
			return this.roundingService.round(this.roundingType.TotalValueOc, bignumber(item.Quantity ?? 0).mul(item.PriceOc ?? 0).sub(discountSplitOc), method);
		} else {
			return this.isNoTax(vatPercent) ?
				item.TotalValueGrossOc :
				this.getAmountPerTaxByAfterTax(item.TotalValueGrossOc, vatPercent, method);
		}
	}

	/**
	 * method name is getTotalValueGrossForInv in angularJs
	 */
	public getTotalValueGross(item: IInv2ContractEntity, vatPercent: number, exchangeRate: number, method?: ProcurementRoundingMethod) {
		if (!this.isOverGross) {
			return this.isNoTax(vatPercent) ?
				item.TotalValue :
				this.getAmountAfterTaxByPreTax(item.TotalValue, vatPercent, method);
		} else {
			return this.isCurrencyParity(exchangeRate) ?
				item.TotalValueGrossOc :
				this.getAmountHomeValueByOc(item.TotalValueGrossOc, exchangeRate, method);
		}
	}

	/**
	 * method name is getTotalValueOcGrossForInv in angularJs
	 */
	public getTotalValueOcGross(item: IInv2ContractEntity, vatPercent: number, method?: ProcurementRoundingMethod) {
		if (!this.isOverGross) {
			return this.isNoTax(vatPercent) ?
				item.TotalValueOc :
				this.getAmountAfterTaxByPreTax(item.TotalValueOc, vatPercent, method);
		} else {
			const discountSplitOc = item.PrcItemFk ? item.DiscountSplitOc : 0;
			return this.roundingService.round(this.roundingType.TotalValueGrossOc, bignumber(item.PriceOcGross).mul(item.Quantity).sub(discountSplitOc), method);
		}
	}
}