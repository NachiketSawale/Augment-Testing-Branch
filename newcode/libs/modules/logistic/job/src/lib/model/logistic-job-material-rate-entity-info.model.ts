/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobMaterialRateDataService } from '../services/logistic-job-material-rate-data.service';
import { ILogisticMaterialRateEntity } from '@libs/logistic/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

export const LOGISTIC_JOB_MATERIAL_RATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticMaterialRateEntity>({
	grid: {
		title: {key: 'logistic.job' + '.materialRateListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.materialRateDetailTitle'},
		containerUuid: '265fbb21125d4d749f72f47922a8ad4f',
	},
	dataService: ctx => ctx.injector.get(LogisticJobMaterialRateDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticMaterialRateDto'},
	permissionUuid: '19ee8d84d00c4b9d936713e302ae49f0',
	layoutConfiguration: async context => {
		const basicsCurrencyLookupProvider = await context.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['MaterialFk', 'CurrencyFk', 'PricePortion1', 'PricePortion2', 'PricePortion3', 'PricePortion4', 'PricePortion5', 'PricePortion6',
						'CommentText'],
				},
			],
			overloads: {
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
				CurrencyFk: basicsCurrencyLookupProvider.provideCurrencyLookupOverload({showClearButton:true}),
			},
			labels: {
				...prefixAllTranslationKeys('logistic.job', {
					PricePortion1: {key: 'pricePortion1'},
					PricePortion2: {key: 'pricePortion2'},
					PricePortion3: {key: 'pricePortion3'},
					PricePortion4: {key: 'pricePortion4'},
					PricePortion5: {key: 'pricePortion5'},
					PricePortion6: {key: 'pricePortion6'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CurrencyFk: {key: 'entityCurrency'},
					CommentText: {key: 'entityCommentText'},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MaterialFk: {key: 'record.materialGroup'},
				})
			}
		};
	},
});
