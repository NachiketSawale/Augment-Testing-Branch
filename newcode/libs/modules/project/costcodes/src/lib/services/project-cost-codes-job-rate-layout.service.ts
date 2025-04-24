/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectCostCodesJobRateEntity } from '@libs/project/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
/**
 * ProjectCostCodes JobRate layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCostCodesJobRateLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IProjectCostCodesJobRateEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['BasFactorCosts', 'BasRealFactorCosts',  'FactorCosts', 'RealFactorCosts',
						'BasFactorHour', 'FactorHour', 'BasFactorQuantity', 'BasRealFactorQuantity',
						'FactorQuantity', 'RealFactorQuantity', 'BasRate', 'Rate', 'BasCurrencyfk', 'Currencyfk',
						'BasDayWorkRate', 'SalesPrice', 'Co2Source', 'Co2Project','Co2SourceFk','LgmJobFk']
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					Co2Source: { key: 'sustainabilty.entityCo2Source' },
					Co2Project: { key: 'sustainabilty.entityCo2Project' },
					Co2SourceFk: { key: 'sustainabilty.entityBasCo2SourceFk' },
				}),
				...prefixAllTranslationKeys('project.costcodes.', {
					Rate: { key: 'rate' },
					FactorCosts: { key: 'factorCosts' },
					RealFactorCosts: { key: 'realFactorCosts' },
					FactorQuantity: { key: 'factorQuantity' },
					FactorHour: { key: 'factorHour' },
					RealFactorQuantity: { key: 'realFactorQuantity' },
					BasRate: { key: 'priceListRate' },
					CurrencyFk: { key: 'currency' },
					SalesPrice:{ key: 'dayWorkRate' },
					LgmJobFk:{key:'lgmJobFk'}
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					BasFactorCosts: { key: 'factorCosts' },
					BasRealFactorCosts: { key: 'realFactorCosts' },
					BasFactorHour: { key: 'factorHour' },
					BasFactorQuantity: { key: 'factorQuantity' },
					BasRealFactorQuantity: { key: 'realFactorQuantity' },				
					BasDayWorkRate: { key: 'dayWorkRate' },
					BasCurrencyFk: { key: 'currency' },
				})
			},
			overloads: {
				BasCurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyReadonlyLookupOverload(),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				LgmJobFk: {
					//TODO: waiting for estimateMainJobLookupByProjectDataService
				},
			},
		};
	}
}
