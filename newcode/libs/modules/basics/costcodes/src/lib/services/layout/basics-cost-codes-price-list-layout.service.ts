/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { BasicsCostCodesPriceVersionLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Basics Cost Codes Price List layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceListLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<ICostcodePriceListEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['CostcodePriceVerFk', 'CurrencyFk', 'Co2Project', 'Co2SourceFk', 'Co2Source', 'FactorCost', 'DayWorkRate', 'FactorHour', 'FactorQuantity', 'Rate', 'RealFactorCost', 'RealFactorQuantity', 'SalesPrice']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {}),
				...prefixAllTranslationKeys('basics.common.', {
					Co2Project: { key: 'sustainabilty.entityCo2Project' },
					Co2SourceFk: { key: 'sustainabilty.entityBasCo2SourceFk' },
					Co2Source: { key: 'sustainabilty.entityCo2Source' },
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					FactorCost: { key: 'factorCosts' },
					DayWorkRate: { key: 'dayWorkRate' },
					FactorHour: { key: 'factorHour' },
					FactorQuantity: { key: 'factorQuantity' },
					Rate: { key: 'rate' },
					RealFactorCost: { key: 'realFactorCosts' },
					RealFactorQuantity: { key: 'realFactorQuantity' },
					SalesPrice: { key: 'DW/T+M Rate' },
					CostcodePriceVerFk: { key: 'priceList.priceVersionDescription' },
					CurrencyFk: { key: 'currency' }
				})
			},
			overloads: {
				CostcodePriceVerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCostCodesPriceVersionLookupService
					}),
				},
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true)
			},
		};
	}
}
