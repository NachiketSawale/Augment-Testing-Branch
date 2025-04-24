/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainCurrencyRateDataService } from '../services/project-main-currency-rate-data.service';
import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedCurrencyLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


export const  projectMainCurrencyRateEntityInfo: EntityInfo = EntityInfo.create<IProjectMainCurrencyRateEntity> ({
	grid: {
		title: {key: 'basics.currency.ExchangeRates'},
	},
	dataService: ctx => ctx.injector.get(ProjectMainCurrencyRateDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'CurrencyRateDto'},
	permissionUuid: '463C61DED9AE494AA02850DBA570234F',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Exchange Rates',
				attributes: ['CurrencyConversionFk', 'CurrencyRateTypeFk','CurrencyHomeFk','CurrencyForeignFk','RateDate','Rate','Basis','Comment'],
			}
		],
		overloads: {
			CurrencyRateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
			CurrencyForeignFk: {
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
				}),
				type: FieldType.Lookup,
				visible: true,
			}
		},
		labels: {
			...prefixAllTranslationKeys('Project.Main', {

			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Comment: { key: 'entityCommentText' },
				Rate: { key: 'entityRate' },
			}),
			...prefixAllTranslationKeys('basics.currency.', {
				CurrencyForeignFk: { key: 'ForeignCurrency' },
				CurrencyConversionFk: { key: 'CurrencyConversion' },
				CurrencyHomeFk: { key: 'currencyHomeFk' },
				CurrencyRateTypeFk: { key: 'currencyRateTypeFk' },
				RateDate: { key: 'RateDate' },
				Basis: { key: 'entityBasis' },
			}),
		},
	},
});