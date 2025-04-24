/*
 * Copyright(c) RIB Software GmbH
 */

import { bignumber } from 'mathjs';
import { Injectable } from '@angular/core';
import { BasicsSharedDecimalPlacesEnum } from '@libs/basics/shared';
import { IPrcCommonItemCalculateEntity } from '../../model/entities';
import { ProcurementCommonCalculationService } from './procurement-common-calculation.service';

/**
 * Procurement PrcItem and PesItem common calculation service
 */
@Injectable({
	providedIn: 'root'
})
export abstract class ProcurementCommonItemCalculationService<T extends IPrcCommonItemCalculateEntity> extends ProcurementCommonCalculationService {
	protected readonly discountAbsoluteDecimalPlace = BasicsSharedDecimalPlacesEnum.decimalPlaces7;
	protected readonly roundingType = this.getRoundingType<T>();

	public getTotal(item: T, vatPercent: number, priceUnit: number, factorPriceUnit: number): number {
		return (!this.isOverGross) ?
			this.round(this.roundingType.Total, this.formula.totalByTotalPrice(item.TotalPrice, item.Quantity, priceUnit, factorPriceUnit, item.DiscountSplit)) :
			this.getTotalByTotalGross(item, vatPercent);
	}

	public getTotalOc(item: T, vatPercent: number, priceUnit: number, factorPriceUnit: number): number {
		return (!this.isOverGross) ?
			this.round(this.roundingType.TotalOc, this.formula.totalByTotalPrice(item.TotalPriceOc, item.Quantity, priceUnit, factorPriceUnit, item.DiscountSplitOc)) :
			this.getTotalOcByTotalGrossOc(item, vatPercent);
	}

	public getTotalByTotalGross(item: T, vatPercent: number): number {
		return this.round(this.roundingType.Total, this.formula.preTaxValueByAfterTax(item.TotalGross, vatPercent));
	}

	public getTotalOcByTotalGrossOc(item: T, vatPercent: number): number {
		return this.round(this.roundingType.Total, this.formula.preTaxValueByAfterTax(item.TotalGrossOc, vatPercent));
	}

	public getTotalGross(item: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number): number {
		return (!this.isOverGross) ?
			this.round(this.roundingType.TotalGross, this.formula.afterTaxValueByPreTax(item.Total, vatPercent)) :
			(this.isCurrencyParity(exchangeRate) ?
					item.TotalGrossOc :
					this.round(this.roundingType.TotalGross, this.formula.totalByTotalPrice(item.TotalPriceGross, item.Quantity, priceUnit, factorPriceUnit, item.DiscountSplit))
			);
	}

	public getTotalGrossOc(item: T, vatPercent: number, priceUnit: number, factorPriceUnit: number): number {
		return (!this.isOverGross) ?
			this.round(this.roundingType.TotalGrossOc, this.formula.afterTaxValueByPreTax(item.TotalOc, vatPercent)) :
			this.round(this.roundingType.TotalGrossOc, this.formula.totalByTotalPrice(item.TotalPriceGrossOc, item.Quantity, priceUnit, factorPriceUnit, item.DiscountSplitOc));
	}

	public getTotalGrossByTotalGrossOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.TotalGross, this.formula.homeCurrencyByOther(item.TotalGrossOc, exchangeRate));
	}

	public getTotalGrossOcByTotalGross(item: T, exchangeRate: number) {
		return this.round(this.roundingType.TotalGrossOc, this.formula.otherCurrencyByHome(item.TotalGross, exchangeRate));
	}

	public getTotalPrice(item: T, vatPercent: number) {
		return (!this.isOverGross) ?
			this.round(this.roundingType.TotalPrice, this.formula.totalPrice(item.Price, item.PriceExtra, item.DiscountAbsolute)) :
			this.round(this.roundingType.TotalPrice, this.formula.preTaxValueByAfterTax(item.TotalPriceGross, vatPercent));
	}

	public getTotalPriceOc(item: T, vatPercent: number) {
		return (!this.isOverGross) ?
			this.round(this.roundingType.TotalPriceOc, this.formula.totalPrice(item.PriceOc, item.PriceExtraOc, item.DiscountAbsoluteOc)) :
			this.round(this.roundingType.TotalPriceOc, this.formula.preTaxValueByAfterTax(item.TotalPriceGrossOc, vatPercent));
	}

	public getTotalPriceByTotalPriceOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.TotalPrice, this.formula.homeCurrencyByOther(item.TotalPriceOc, exchangeRate));
	}

	public getTotalPriceGross(item: T, vatPercent: number, exchangeRate: number) {
		let result;
		if (!this.isOverGross) {
			const totalPrice = this.formula.totalPrice(item.Price, item.PriceExtra, item.DiscountAbsolute);
			result = this.formula.afterTaxValueByPreTax(totalPrice, vatPercent);
		} else {
			if (this.isCurrencyParity(exchangeRate)) {
				result = item.TotalPriceGrossOc;
			} else {
				const priceExtraGross = this.formula.afterTaxValueByPreTax(item.PriceExtra, vatPercent);
				result = this.formula.totalPrice(item.PriceGross, priceExtraGross, item.DiscountAbsoluteGross);
			}
		}
		return this.round(this.roundingType.TotalPriceGross, result);
	}

	public getTotalPriceOCGross(item: T, vatPercent: number) {
		let result;
		if (!this.isOverGross) {
			const totalPriceOc = this.formula.totalPrice(item.PriceOc, item.PriceExtraOc, item.DiscountAbsoluteOc);
			result = this.formula.afterTaxValueByPreTax(totalPriceOc, vatPercent);
		} else {
			const priceExtraGrossOc = this.formula.afterTaxValueByPreTax(item.PriceExtraOc, vatPercent);
			result = this.formula.totalPrice(item.PriceGrossOc, priceExtraGrossOc, item.DiscountAbsoluteGrossOc);
		}
		return this.round(this.roundingType.TotalPriceGrossOc, result);
	}

	public getTotalPriceGrossByTotalPriceGrossOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.TotalPriceGross, this.formula.homeCurrencyByOther(item.TotalPriceGrossOc, exchangeRate));
	}

	public getTotalPriceGrossByTotalGross(item: T, priceUnit: number, factorPriceUnit: number) {
		return this.round(this.roundingType.TotalPriceGross, this.formula.totalPriceByTotal(item.TotalGross, item.DiscountSplit, item.Quantity, priceUnit, factorPriceUnit));
	}

	public getTotalPriceOCGrossByTotalGrossOc(item: T, priceUnit: number, factorPriceUnit: number) {
		return this.round(this.roundingType.TotalPriceGrossOc, this.formula.totalPriceByTotal(item.TotalGrossOc, item.DiscountSplitOc, item.Quantity, priceUnit, factorPriceUnit));
	}

	public getTotalPriceNoDiscount(item: T) {
		return this.round(this.roundingType.TotalPrice, this.formula.totalPriceNoDiscount(item.Price, item.PriceExtra));
	}

	public getTotalPriceOcNoDiscount(item: T) {
		return this.round(this.roundingType.TotalPriceOc, this.formula.totalPriceNoDiscount(item.PriceOc, item.PriceExtraOc));
	}

	public getFactoredTotalPrice(item: T, priceUnit: number) {
		return this.round(this.roundingType.TotalPrice, this.formula.factoredTotalPrice(item.Price, item.PriceExtra, item.DiscountAbsolute, priceUnit));
	}

	public getDiscountAbsolute(item: T) {
		return this.roundTo(this.formula.discountAbsolute(item.Price, item.PriceExtra, item.Discount).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteOc(item: T) {
		return this.roundTo(this.formula.discountAbsolute(item.PriceOc, item.PriceExtraOc, item.Discount).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteByOc(item: T, exchangeRate: number) {
		return this.roundTo(this.formula.homeCurrencyByOther(item.DiscountAbsoluteOc, exchangeRate).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteByGross(item: T, vatPercent: number) {
		return this.roundTo(this.formula.preTaxValueByAfterTax(item.DiscountAbsoluteGross, vatPercent).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteOcByDA(item: T, exchangeRate: number) {
		return this.roundTo(this.formula.otherCurrencyByHome(item.DiscountAbsolute, exchangeRate).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteOcByGrossOc(item: T, vatPercent: number) {
		return this.roundTo(this.formula.preTaxValueByAfterTax(item.DiscountAbsoluteGrossOc, vatPercent).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossByDA(item: T, vatPercent: number) {
		return this.roundTo(this.formula.afterTaxValueByPreTax(item.DiscountAbsolute, vatPercent).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossByPriceGross(item: T, vatPercent: number) {
		const priceExtraGross = this.formula.afterTaxValueByPreTax(item.PriceExtra, vatPercent);
		return this.roundTo(this.formula.discountAbsolute(item.PriceGross, priceExtraGross, item.Discount).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossByGrossOc(item: T, exchangeRate: number) {
		return this.roundTo(this.formula.homeCurrencyByOther(item.DiscountAbsoluteGrossOc, exchangeRate).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossOcByGross(item: T, exchangeRate: number) {
		return this.roundTo(this.formula.otherCurrencyByHome(item.DiscountAbsoluteGross, exchangeRate).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossOcByOc(item: T, vatPercent: number) {
		return this.roundTo(this.formula.afterTaxValueByPreTax(item.DiscountAbsoluteOc, vatPercent).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscountAbsoluteGrossOcByPriceGrossOc(item: T, vatPercent: number) {
		const priceExtraOcGross = this.formula.afterTaxValueByPreTax(item.PriceExtraOc, vatPercent);
		return this.roundTo(this.formula.discountAbsolute(item.PriceGrossOc, priceExtraOcGross, item.Discount).toNumber(), this.discountAbsoluteDecimalPlace);
	}

	public getDiscount(item: T) {
		const totalPriceOc = this.getTotalPriceOcNoDiscount(item);
		if (totalPriceOc !== 0) {
			return this.round(this.roundingType.NoType, this.formula.discount(totalPriceOc, item.DiscountAbsoluteOc));
		}
		return 0;
	}

	public getDiscountSplitByOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.DiscountSplitOc, this.formula.homeCurrencyByOther(item.DiscountSplitOc, exchangeRate));
	}

	public getPriceExtraByExchangeRate(item: T, exchangeRate: number) {
		return this.round(this.roundingType.PriceExtra, this.formula.homeCurrencyByOther(item.PriceExtraOc, exchangeRate));
	}

	public getPriceExtraOcByExchangeRate(item: T, exchangeRate: number) {
		return this.round(this.roundingType.PriceExtraOc, this.formula.otherCurrencyByHome(item.PriceExtra, exchangeRate));
	}

	public getPriceFromTotalGross(totalGross: number, quantity: number, priceExtra: number, vatPercent: number, discount: number, priceUnit: number, factorPriceUnit: number, discountSplit: number) {
		const total = this.formula.preTaxValueByAfterTax(totalGross, vatPercent);
		return this.round(this.roundingType.Price, this.formula.priceByTotal(total, quantity, priceExtra, discount, priceUnit, factorPriceUnit, discountSplit));
	}

	public getPriceFromTotalOcGross(totalGrossOc: number, quantity: number, priceOcExtra: number, vatPercent: number, discount: number, priceUnit: number, factorPriceUnit: number, discountSplitOc: number, exchangeRate: number) {
		const totalOc = this.formula.preTaxValueByAfterTax(totalGrossOc, vatPercent);
		const priceOc = this.formula.priceByTotal(totalOc, quantity, priceOcExtra, discount, priceUnit, factorPriceUnit, discountSplitOc);
		return this.round(this.roundingType.Price, this.formula.homeCurrencyByOther(priceOc, exchangeRate));
	}

	public getPriceFromTotal(item: T, total: number, priceExtra: number, priceUnit: number, factorPriceUnit: number) {
		return this.round(this.roundingType.Price, this.formula.priceByTotal(total, item.Quantity, priceExtra, item.Discount, priceUnit, factorPriceUnit, item.DiscountSplit));
	}

	public getPriceFromTotalOc(item: T, totalOc: number, priceOcExtra: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		const priceOc = this.formula.priceByTotal(totalOc, item.Quantity, priceOcExtra, item.Discount, priceUnit, factorPriceUnit, item.DiscountSplitOc);
		return this.round(this.roundingType.Price, this.formula.homeCurrencyByOther(priceOc, exchangeRate));
	}

	public getPriceFromTotalNoDiscount(item: T, totalNoDiscount: number, priceExtra: number, priceUnit: number, factorPriceUnit: number) {
		return this.round(this.roundingType.Price, this.formula.priceByTotalNoDiscount(totalNoDiscount, item.Quantity, priceExtra, priceUnit, factorPriceUnit));
	}

	public getPriceFromTotalOcNoDiscount(item: T, totalOcNoDiscount: number, priceOcExtra: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		const priceOc = this.formula.priceByTotalNoDiscount(totalOcNoDiscount, item.Quantity, priceOcExtra, priceUnit, factorPriceUnit);
		return this.round(this.roundingType.Price, this.formula.homeCurrencyByOther(priceOc, exchangeRate));
	}

	public getPrice(item: T, vatPercent: number) {
		return this.round(this.roundingType.Price, this.formula.preTaxValueByAfterTax(item.PriceGross, vatPercent));
	}

	public getPriceOc(item: T, vatPercent: number) {
		return this.round(this.roundingType.PriceOc, this.formula.preTaxValueByAfterTax(item.PriceGrossOc, vatPercent));
	}

	public getPriceByPriceOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.Price, this.formula.homeCurrencyByOther(item.PriceOc, exchangeRate));
	}

	public getPriceOcByPriceGross(item: T, vatPercent: number, exchangeRate: number) {
		const priceGrossOc = this.formula.otherCurrencyByHome(item.PriceGross, exchangeRate);
		return this.round(this.roundingType.PriceOc, this.formula.preTaxValueByAfterTax(priceGrossOc, vatPercent));
	}

	public getPriceOcByExchangeRate(item: T, exchangeRate: number) {
		return this.round(this.roundingType.PriceOc, this.formula.otherCurrencyByHome(item.Price, exchangeRate));
	}

	public getPriceByMdcCost(cost: number, priceExtra: number) {
		return this.round(this.roundingType.Price, this.formula.priceByCost(cost, priceExtra));
	}

	public getPriceOcByMdcCost(cost: number, priceExtra: number, rate: number) {
		return this.round(this.roundingType.PriceOc, this.formula.priceOcByCost(cost, priceExtra, rate));
	}

	public getPriceGross(item: T, vatPercent: number) {
		return this.round(this.roundingType.PriceGross, this.formula.afterTaxValueByPreTax(item.Price, vatPercent));
	}

	public getPriceGrossByPriceGrossOc(item: T, exchangeRate: number) {
		return this.round(this.roundingType.PriceGross, this.formula.homeCurrencyByOther(item.PriceGrossOc, exchangeRate));
	}

	public getPriceGrossOc(item: T, vatPercent: number) {
		return this.round(this.roundingType.PriceGrossOc, this.formula.afterTaxValueByPreTax(item.PriceOc, vatPercent));
	}

	public getPriceGrossOcByPriceGross(item: T, exchangeRate: number) {
		return this.round(this.roundingType.PriceGrossOc, this.formula.otherCurrencyByHome(item.PriceGross, exchangeRate));
	}

	public getPriceGrossByTotalPriceGross(totalPriceGross: number, priceExtra: number, discountAbsoluteGross: number, vatPercent: number) {
		const priceExtraGross = this.formula.afterTaxValueByPreTax(priceExtra, vatPercent);
		return this.round(this.roundingType.PriceGross, this.formula.priceByTotalPrice(totalPriceGross, priceExtraGross, discountAbsoluteGross));
	}

	public getPriceGrossOcByTotalPriceGrossOc(totalPriceGrossOc: number, priceExtraOc: number, discountAbsoluteGrossOc: number, vatPercent: number) {
		const priceExtraOcGross = this.formula.afterTaxValueByPreTax(priceExtraOc, vatPercent);
		return this.round(this.roundingType.PriceGrossOc, this.formula.priceByTotalPrice(totalPriceGrossOc, priceExtraOcGross, discountAbsoluteGrossOc));
	}

	public update4PriceFields(item: T, value: number, field: PriceField, vatPercent: number, rate: number) {
		const currencyParity = this.isCurrencyParity(rate);
		const noTax = this.isNoTax(vatPercent);
		switch (field) {
			case 'Price': {
				item.Price = value;
				item.PriceOc = currencyParity ? item.Price : this.round(this.roundingType.PriceOc, this.formula.otherCurrencyByHome(item.Price, rate));
				item.PriceGross = noTax ? item.Price : this.round(this.roundingType.PriceGross, this.formula.afterTaxValueByPreTax(item.Price, vatPercent));
				item.PriceGrossOc = this.isOverGross ?
					(currencyParity ? item.PriceGross : this.round(this.roundingType.PriceGrossOc, this.formula.otherCurrencyByHome(item.PriceGross, rate))) :
					(noTax ? item.PriceOc : this.round(this.roundingType.PriceGrossOc, this.formula.afterTaxValueByPreTax(item.PriceOc, vatPercent)));
				break;
			}
			case 'PriceOc': {
				item.PriceOc = value;
				item.Price = currencyParity ? item.PriceOc : this.round(this.roundingType.Price,this.formula.homeCurrencyByOther(item.PriceOc, rate));
				item.PriceGrossOc = noTax ? item.PriceOc : this.round(this.roundingType.PriceGrossOc, this.formula.afterTaxValueByPreTax(item.PriceOc, vatPercent));
				item.PriceGross = this.isOverGross ?
					(currencyParity ? item.PriceGrossOc : this.round(this.roundingType.PriceGross, this.formula.homeCurrencyByOther(item.PriceGrossOc, rate) )) :
					(noTax ? item.Price : this.round(this.roundingType.PriceGross, this.formula.afterTaxValueByPreTax(item.Price, vatPercent)));
				break;
			}
			case 'PriceGross': {
				item.PriceGross = value;
				item.Price = noTax ? item.PriceGross : this.round(this.roundingType.Price, this.formula.preTaxValueByAfterTax(item.PriceGross, vatPercent));
				item.PriceGrossOc = currencyParity ? item.PriceGross : this.round(this.roundingType.PriceGrossOc, this.formula.otherCurrencyByHome(item.PriceGross, rate));
				item.PriceOc = this.isOverGross ?
					(noTax ? item.PriceGrossOc : this.round(this.roundingType.PriceOc, this.formula.preTaxValueByAfterTax(item.PriceGrossOc, vatPercent))) :
					(currencyParity ? item.Price : this.round(this.roundingType.PriceOc, this.formula.otherCurrencyByHome(item.Price, rate)));
				break;
			}
			case 'PriceGrossOc': {
				item.PriceGrossOc = value;
				item.PriceGross = currencyParity ? item.PriceGrossOc : this.round(this.roundingType.PriceGross, this.formula.homeCurrencyByOther(item.PriceGrossOc, rate));
				item.PriceOc = noTax ? item.PriceGrossOc : this.round(this.roundingType.PriceOc, this.formula.preTaxValueByAfterTax(item.PriceGrossOc, vatPercent));
				item.Price = this.isOverGross ?
					(noTax ? item.PriceGross : this.round(this.roundingType.Price, this.formula.preTaxValueByAfterTax(item.PriceGross, vatPercent))) :
					(currencyParity ? item.PriceOc : this.round(this.roundingType.Price, this.formula.homeCurrencyByOther(item.PriceOc, rate)));
				break;
			}
			default: {
				break;
			}
		}
	}

	public updateDiscountNAbsolute(entity: T, value: number, model: DiscountAndAbsoluteField, vatPercent: number, rate: number) {
		if (value === 0) {
			entity.Discount = 0;
			entity.DiscountAbsolute = 0;
			entity.DiscountAbsoluteOc = 0;
			entity.DiscountAbsoluteGross = 0;
			entity.DiscountAbsoluteGrossOc = 0;
		}
		entity[model] = value;
		if (model === 'Discount') {
			entity.DiscountAbsolute = this.getDiscountAbsolute(entity);
			entity.DiscountAbsoluteOc = this.getDiscountAbsoluteOc(entity);
			entity.DiscountAbsoluteGross = this.getDiscountAbsoluteGrossByPriceGross(entity, vatPercent);
			entity.DiscountAbsoluteGrossOc = this.getDiscountAbsoluteGrossOcByPriceGrossOc(entity, vatPercent);
		} else {
			switch (model) {
				case 'DiscountAbsolute': {
					entity.DiscountAbsoluteOc = this.getDiscountAbsoluteOcByDA(entity, rate);
					entity.DiscountAbsoluteGross = this.getDiscountAbsoluteGrossByDA(entity, vatPercent);
					entity.DiscountAbsoluteGrossOc = this.isOverGross ?
						this.getDiscountAbsoluteGrossOcByGross(entity, rate) :
						this.getDiscountAbsoluteGrossOcByOc(entity, vatPercent);
					break;
				}
				case 'DiscountAbsoluteOc': {
					entity.DiscountAbsolute = this.getDiscountAbsoluteByOc(entity, rate);
					entity.DiscountAbsoluteGrossOc = this.getDiscountAbsoluteGrossOcByOc(entity, vatPercent);
					entity.DiscountAbsoluteGross = this.isOverGross ?
						this.getDiscountAbsoluteGrossByGrossOc(entity, rate) :
						this.getDiscountAbsoluteGrossByDA(entity, vatPercent);
					break;
				}
				case 'DiscountAbsoluteGross': {
					entity.DiscountAbsolute = this.getDiscountAbsoluteByGross(entity, vatPercent);
					entity.DiscountAbsoluteGrossOc = this.getDiscountAbsoluteGrossOcByGross(entity, rate);
					entity.DiscountAbsoluteOc = this.isOverGross ?
						this.getDiscountAbsoluteOcByGrossOc(entity, vatPercent) :
						this.getDiscountAbsoluteOcByDA(entity, rate);
					break;
				}
				case 'DiscountAbsoluteGrossOc': {
					entity.DiscountAbsoluteGross = this.getDiscountAbsoluteGrossByGrossOc(entity, rate);
					entity.DiscountAbsoluteOc = this.getDiscountAbsoluteOcByGrossOc(entity, vatPercent);
					entity.DiscountAbsolute = this.isOverGross ?
						this.getDiscountAbsoluteByGross(entity, vatPercent) :
						this.getDiscountAbsoluteByOc(entity, rate);
					break;
				}
				default: {
					break;
				}
			}
			const totalPriceOc = bignumber(entity.PriceOc).add(entity.PriceExtraOc).toNumber();
			entity.Discount = totalPriceOc === 0 ? 0 :
				this.round(this.roundingType.NoType, bignumber(entity.DiscountAbsoluteOc).div(totalPriceOc).mul(100));
		}


	}

	public calculateAfterVatPercentChanged(item: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		if (!this.isOverGross) {
			this.calculatePriceGrossFields(item, vatPercent);
			this.calculateTotalPriceGrossFields(item, vatPercent, exchangeRate);
			this.calculateTotalGross(item, vatPercent, exchangeRate, priceUnit, factorPriceUnit);
		} else {
			this.calculatePriceFields(item, vatPercent);
			this.calculateTotalPriceFields(item, vatPercent);
			this.calculateTotalNet(item, vatPercent, priceUnit, factorPriceUnit);
		}
	}

	public calculateAfterInputTotalGross(item: T, value: number, inputField: TotalGrossField, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		if (inputField === 'TotalGross') {
			item.TotalGross = value;
			item.TotalGrossOc = this.getTotalGrossOcByTotalGross(item, exchangeRate);
		} else {
			item.TotalGrossOc = value;
			item.TotalGross = this.getTotalGrossByTotalGrossOc(item, exchangeRate);
		}

		item.TotalOc = this.getTotalOcByTotalGrossOc(item, vatPercent);
		item.Total = this.getTotalByTotalGross(item, vatPercent);
		item.TotalPriceGrossOc = this.getTotalPriceOCGrossByTotalGrossOc(item, priceUnit, factorPriceUnit);
		item.TotalPriceGross = this.getTotalPriceGrossByTotalGross(item, priceUnit, factorPriceUnit);
		item.TotalPriceOc = this.getTotalPriceOc(item, vatPercent);
		item.TotalPrice = this.getTotalPrice(item, vatPercent);
		item.PriceGrossOc = this.getPriceGrossOcByTotalPriceGrossOc(item.TotalPriceGrossOc, item.PriceExtraOc, item.DiscountAbsoluteGrossOc, vatPercent);
		item.PriceGross = this.getPriceGrossByTotalPriceGross(item.TotalPriceGross, item.PriceExtra, item.DiscountAbsoluteGross, vatPercent);
		item.PriceOc = this.getPriceOc(item, vatPercent);
		item.Price = this.getPrice(item, vatPercent);
	}

	/**
	 * Calculate total fields
	 * TotalOc, Total, TotalGrossOc, TotalGross
	 * @param entity
	 * @param vatPercent
	 * @param exchangeRate
	 * @param priceUnit
	 * @param factorPriceUnit
	 */
	public calculateTotal(entity: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		this.calculateTotalPriceNTotal(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit, true);
	}

	/**
	 * Calculate totalPrice and total fields
	 * TotalPriceOc, TotalPrice, TotalPriceGrossOc, TotalPriceGross
	 * TotalOc, Total, TotalGrossOc, TotalGross
	 * @param entity
	 * @param vatPercent
	 * @param exchangeRate
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @param onlyCalculateTotal
	 */
	public calculateTotalPriceNTotal(entity: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number, onlyCalculateTotal: boolean = false) {
		if (!this.isOverGross) {
			this.calculateTotalInNetMode(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit, onlyCalculateTotal);
		} else {
			this.calculateTotalInGrossMode(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit, onlyCalculateTotal);
		}
	}

	/**
	 * Calculate totalPrice and total fields in net mode
	 * @param entity
	 * @param vatPercent
	 * @param exchangeRate
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @param onlyCalculateTotal
	 */
	public calculateTotalInNetMode(entity: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number, onlyCalculateTotal = false) {
		if (!onlyCalculateTotal) {
			this.calculateTotalPriceFields(entity, vatPercent);
			this.calculateTotalPriceGrossFields(entity, vatPercent, exchangeRate);
		}
		this.calculateTotalNet(entity, vatPercent, priceUnit, factorPriceUnit);
		this.calculateTotalGross(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit);
	}

	/**
	 * Calculate totalPrice and total fields in gross mode
	 * @param entity
	 * @param vatPercent
	 * @param exchangeRate
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @param onlyCalculateTotal
	 */
	public calculateTotalInGrossMode(entity: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number, onlyCalculateTotal = false) {
		if (!onlyCalculateTotal) {
			this.calculateTotalPriceGrossFields(entity, vatPercent, exchangeRate);
			this.calculateTotalPriceFields(entity, vatPercent);
		}
		this.calculateTotalGross(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit);
		this.calculateTotalNet(entity, vatPercent, priceUnit, factorPriceUnit);
	}

	/**
	 * Calculate TotalGrossOc and TotalGross
	 * gross mode by:TotalPriceGrossOc/TotalPriceGross, net mode by:TotalOc/Total
	 * @param entity
	 * @param exchangeRate
	 * @param vatPercent
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @private
	 */
	public calculateTotalGross(entity: T, vatPercent: number, exchangeRate: number, priceUnit: number, factorPriceUnit: number) {
		entity.TotalGrossOc = this.getTotalGrossOc(entity, vatPercent, priceUnit, factorPriceUnit);
		entity.TotalGross = this.getTotalGross(entity, vatPercent, exchangeRate, priceUnit, factorPriceUnit);
	}
	/**
	 * Calculate TotalOc, Total
	 * TotalOc/Total: gross mode by:TotalGrossOc/TotalGross, net mode by:TotalPriceOc/TotalPrice
	 * @param entity
	 * @param vatPercent
	 * @param priceUnit
	 * @param factorPriceUnit
	 * @private
	 */
	public calculateTotalNet(entity: T, vatPercent: number, priceUnit: number, factorPriceUnit: number) {
		entity.TotalOc = this.getTotalOc(entity, vatPercent, priceUnit, factorPriceUnit);
		entity.Total = this.getTotal(entity, vatPercent, priceUnit, factorPriceUnit);
	}

	/**
	 * Calculate PriceOc and Price by PriceGrossOc and PriceGross
	 * @param entity
	 * @param vatPercent
	 * @private
	 */
	public calculatePriceFields(entity: T, vatPercent: number) {
		entity.Price = this.getPrice(entity, vatPercent);
		entity.PriceOc = this.getPriceOc(entity, vatPercent);
	}

	/**
	 * Calculate PriceGrossOc and PriceGross by PriceOc and Price
	 * @param entity
	 * @param vatPercent
	 * @private
	 */
	public calculatePriceGrossFields(entity: T, vatPercent: number) {
		entity.PriceGrossOc = this.getPriceGrossOc(entity, vatPercent);
		entity.PriceGross = this.getPriceGross(entity, vatPercent);
	}

	/**
	 * Set TotalPriceOc and TotalPrice
	 * gross mode by:TotalPriceGrossOc/TotalPriceGross, net mode by:PriceOc/Price
	 * @param entity
	 * @param vatPercent
	 * @private
	 */
	public calculateTotalPriceFields(entity: T, vatPercent: number) {
		entity.TotalPriceOc = this.getTotalPriceOc(entity, vatPercent);
		entity.TotalPrice = this.getTotalPrice(entity, vatPercent);
	}

	/**
	 * Set TotalPriceGrossOc and TotalPriceGross
	 * gross mode by:PriceGrossOc/PriceGross, net mode by:PriceOc/Price
	 * @param entity
	 * @param exchangeRate
	 * @param vatPercent
	 * @private
	 */
	public calculateTotalPriceGrossFields(entity: T, vatPercent: number, exchangeRate: number) {
		entity.TotalPriceGrossOc = this.getTotalPriceOCGross(entity, vatPercent);
		entity.TotalPriceGross = this.getTotalPriceGross(entity, vatPercent, exchangeRate);
	}
}

export type PriceField = keyof (Pick<IPrcCommonItemCalculateEntity, 'Price' | 'PriceOc' | 'PriceGross' | 'PriceGrossOc'>);
export type DiscountAbsoluteField = keyof (Pick<IPrcCommonItemCalculateEntity, 'DiscountAbsolute' | 'DiscountAbsoluteOc' | 'DiscountAbsoluteGross' | 'DiscountAbsoluteGrossOc'>);
export type DiscountAndAbsoluteField = keyof (Pick<IPrcCommonItemCalculateEntity, 'Discount' | DiscountAbsoluteField>);
export type TotalGrossField = keyof (Pick<IPrcCommonItemCalculateEntity, 'TotalGross' | 'TotalGrossOc'>);