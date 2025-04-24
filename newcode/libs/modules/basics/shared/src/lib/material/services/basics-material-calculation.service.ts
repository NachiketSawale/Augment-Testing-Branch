/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IMaterialPriceConditionEntity,
	IMaterialEntity
} from '@libs/basics/interfaces';
import { inject, Injectable } from '@angular/core';
import { sumBy } from 'lodash';
import { BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule } from '../../rounding';
import { BasicsSharedTaxCodeLookupService } from '../../lookup-services/tax-code-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialCalculationService<T extends IMaterialEntity = IMaterialEntity> {
	//TODO a temporary object, remove it after rounding function ready
	private roundType = {
		CostPriceGross: 2,
		ListPrice: 2,
		Cost: 2
	};
	private readonly basicsRoundingService = BasicsSharedRoundingFactoryService.getService(BasicsSharedRoundingModule.basicsMaterial);
	protected readonly taxCodeLookup = inject(BasicsSharedTaxCodeLookupService);

	private getTaxCodeVatPercent(entity: T) {
		let vatPercent = 0;
		if (this.taxCodeLookup.cache.list.length < 1) {
			this.taxCodeLookup.getList();
		}
		if (entity.MdcTaxCodeFk) {
			const taxCode = this.taxCodeLookup.cache.getItem({id: entity.MdcTaxCodeFk});
			vatPercent = taxCode?.VatPercent ?? 0;
		}
		return vatPercent;
	}

	/**
	 * Calculate cost
	 * @param material
	 * @param value
	 * @param model
	 */
	public calculateCost(material: T, value?: number, model?: string): void {
		if (material) {
			const listPrice = (model === 'ListPrice' && value) ? value : material.ListPrice;
			const discount = (model === 'Discount' && value) ? value : material.Discount;
			const charges = (model === 'Charges' && value) ? value : material.Charges;
			const priceExtra = (model === 'PriceExtra' && value) ? value : material.PriceExtra;
			material.Cost = this.getCostByLisPrice(listPrice, discount, charges, priceExtra);
			const vatPercent = this.getTaxCodeVatPercent(material);
			material.CostPriceGross = this.getCostPriceGrossByCost(material, vatPercent);
		}
	}

	/**
	 * Calculate cost by CostPriceGross
	 * @param entity
	 */
	public calculateCostByCostPriceGross(entity: T){
		const vatPercent = this.getTaxCodeVatPercent(entity);
		const costWithoutRound = this.getCostByCostPriceGross(entity, vatPercent, false);
		//TODO update it after rounding ready
		//TODO check whether can move 'if else'
		if (!entity.PrcPriceconditionFk) {
			const listPriceWithoutRound = this.getListPriceByCost(costWithoutRound, entity.PriceExtra, entity.Charges, entity.Discount, false);
			entity.Cost = this.getCostByLisPrice(listPriceWithoutRound, entity.Discount, entity.Charges, entity.PriceExtra);
			entity.ListPrice = this.getListPriceByCost(costWithoutRound, entity.PriceExtra, entity.Charges, entity.Discount);
		} else {
			entity.ListPrice = this.getListPriceByCost(costWithoutRound, entity.PriceExtra, entity.Charges, entity.Discount);
			entity.Cost = this.getCostByCostPriceGross(entity, vatPercent);
		}
		entity.EstimatePrice = entity.Cost;
		entity.DayworkRate = entity.Cost;
	}

	/**
	 * Calculate cost
	 * @param itemList
	 */
	public calculateCostPriceGross(itemList: T[]): void {
		itemList.forEach(item => {
			const vatPercent = this.getTaxCodeVatPercent(item);
			item.CostPriceGross = this.getCostPriceGrossByCost(item, vatPercent);
		});
	}

	/**
	 * Calculate price extra
	 * @param item
	 * @param priceConditions
	 */
	public updatePriceExtra(item: T, priceConditions: IMaterialPriceConditionEntity[]) {
		item.PriceExtra = sumBy(priceConditions, i => {
			return i.PriceConditionType?.IsPriceComponent && i.IsActivated ? i.Total : 0;
		});
	}

	private getCostByCostPriceGross(item: T, vatPercent: number, rounding: boolean = true) {
		const result = item.CostPriceGross * 100 / (100 + vatPercent);
		return rounding ? this.basicsRoundingService.doRounding(this.roundType.Cost, result) : result;
	}

	private getCostPriceGrossByCost(item: T, vatPercent: number): number {
		return this.basicsRoundingService.doRounding(this.roundType.CostPriceGross, item.Cost * (100 + vatPercent) / 100);
	}

	private getCostByLisPrice(listPrice: number, discount: number, charges: number, priceExtra: number): number {
		return this.basicsRoundingService.doRounding(this.roundType.Cost,listPrice * (100 - discount) / 100 + (charges) + (priceExtra));
	}

	private getListPriceByCost(cost: number, priceExtra: number, charges: number, discount: number, rounding: boolean = true): number {
		const result = (cost - priceExtra - charges) * 100 / (100 - discount);
		return rounding ? this.basicsRoundingService.doRounding(this.roundType.ListPrice, result) : result;
	}
}