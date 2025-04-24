/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule, noRoundingType } from '../rounding';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';
import { BasicsSharedScopeOfSupplyTypeLookupService } from '../lookup-services/customize';


@Injectable({
	providedIn: 'root'
})
export class BasicScopeDetailCalculationService<T extends IMaterialScopeDetailEntity> {
	private readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	private readonly scopeOfSupplyTypeLookupService = inject(BasicsSharedScopeOfSupplyTypeLookupService);

	public readonly roundingType = this.getRoundingType();

	/**
	 * Get rounding type
	 * Todo - this function should be in base rounding service
	 */
	public getRoundingType() {
		return this.roundingService.fieldsRoundType as Record<(keyof (T & noRoundingType)), number>;
	}

	public convertToOc(value: number, exchangeRate: number, roundingField?: number): number {
		const valueOc = value * exchangeRate;
		return this.round(valueOc, roundingField);
	}

	public convertFromOc(valueOc: number, exchangeRate: number, roundingField?: number): number {
		if (exchangeRate === 0) {
			exchangeRate = 1;
		}

		const value = valueOc / exchangeRate;
		return this.round(value, roundingField);
	}

	public round(value: number, roundingField?: number) {
		if (!roundingField) {
			return value;
		}

		return this.roundingService.doRounding(roundingField, value);
	}

	/**
	 * Calculate scope detail total
	 * @param entity
	 */
	public calculateTotal(entity: T): void {
		if (entity.PriceUnit * entity.FactorPriceUnit === 0) {
			entity.Total = 0;
			entity.TotalCurrency = 0;
		} else {
			entity.Total = this.roundingService.doRounding(this.roundingType.Total, ((entity.Price + entity.PriceExtra) * entity.Quantity / entity.PriceUnit * entity.FactorPriceUnit));
			entity.TotalCurrency = this.roundingService.doRounding(this.roundingType.TotalCurrency, ((entity.PriceOc + entity.PriceExtraOc) * entity.Quantity / entity.PriceUnit * entity.FactorPriceUnit));
		}
	}

	/**
	 * Calculate scope total for all related scope detail
	 * @param list
	 */
	public async calculateScopeTotal(list: T[]) {
		const result = {
			total: 0,
			totalOc: 0,
			price: 0,
			priceOc: 0,
			priceExtra: 0,
			priceExtraOc: 0
		};
		const scopeOfSupplyTypes = await firstValueFrom(this.scopeOfSupplyTypeLookupService.getList());
		const scopeOfSupplyTypeIds = scopeOfSupplyTypes.filter(e => e.Ispricecomponent).map(e => e.Id);

		list.filter(e => scopeOfSupplyTypeIds.indexOf(e.ScopeOfSupplyTypeFk) !== -1).forEach(e => {
			result.total += e.Total;
			result.totalOc += e.TotalCurrency;
			result.price += e.Price;
			result.priceOc += e.PriceOc;
			result.priceExtra += e.PriceExtra;
			result.priceExtraOc += e.PriceExtraOc;
		});

		return result;
	}
}