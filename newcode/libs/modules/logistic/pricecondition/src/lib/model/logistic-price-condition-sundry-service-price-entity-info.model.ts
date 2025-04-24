/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionSundryServicePriceDataService } from '../services/logistic-price-condition-sundry-service-price-data.service';
import { ILogisticSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/shared';


export const LOGISTIC_PRICE_CONDITION_SUNDRY_SERVICE_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticSundryServicePriceEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listSundryServicePriceTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailSundryServicePriceTitle'},
		containerUuid: '9eefecb804a840e0bcefd6825c957374',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionSundryServicePriceDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticSundryServicePriceDto'},
	permissionUuid: '76206e93e60a4f60a71fd0d0961c6da1',
	layoutConfiguration: async ctx=> {
		const sundryServiceOverload = await ctx.lazyInjector.inject(LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ILogisticSundryServicePriceEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['SundryServiceFk', 'CommentText', 'IsManual', 'PricePortion1', 'PricePortion2', 'PricePortion3', 'PricePortion4', 'PricePortion5',
						'PricePortion6', 'ValidFrom', 'ValidTo'],
				}
			],
			overloads: {
				SundryServiceFk: sundryServiceOverload.provideLogisticSundryServiceLookupOverload()
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					PricePortion1: {key: 'pricePortion1'},
					PricePortion2: {key: 'pricePortion2'},
					PricePortion3: {key: 'pricePortion3'},
					PricePortion4: {key: 'pricePortion4'},
					PricePortion5: {key: 'pricePortion5'},
					PricePortion6: {key: 'pricePortion6'},
				}),
				...prefixAllTranslationKeys('logistic.sundryservice.', {
					SundryServiceFk: {key: 'entitySundryService'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'},
					ValidFrom: {key: 'entityValidFrom'},
					ValidTo: {key: 'entityValidTo'}
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					IsManual: {key: 'isManual'},
				})
			}
		};
		},
});