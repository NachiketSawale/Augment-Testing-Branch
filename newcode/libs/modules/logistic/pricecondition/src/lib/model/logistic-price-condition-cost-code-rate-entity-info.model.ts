/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionCostCodeRateDataService } from '../services/logistic-price-condition-cost-code-rate-data.service';
import { ILogisticCostCodeRateEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticPriceConditionCostCodeRateValidationService } from '../services/logistic-price-condition-cost-code-rate-validation.service';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';


export const LOGISTIC_PRICE_CONDITION_COST_CODE_RATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCostCodeRateEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listCostCodeRateTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailCostCodeRateTitle'},
		containerUuid: 'e37b49b2796d4950bd7c54dfaf6cf86a',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionCostCodeRateDataService),
	validationService: ctx => ctx.injector.get(LogisticPriceConditionCostCodeRateValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticCostCodeRateDto'},
	permissionUuid: 'e07d54925ba64e7db4928907939e1bda',

	layoutConfiguration: async context => {
		const basicsCurrencyLookupProvider = await context.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [/*'CostCodeFk',*/ 'Rate', 'SalesPrice', 'CurrencyFk', 'CommentText'],
				}
			],
			overloads: {
				CurrencyFk: basicsCurrencyLookupProvider.provideCurrencyLookupOverload({showClearButton: true}),
				//CostCodeFk - To be discuss, Lookup is not available.
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					CostCodeFk: {key: 'entityCostCode'},
					Rate: {key: 'costCodeRateEntity'},
					SalesPrice: {key: 'entitySalesPrice'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CurrencyFk: {key: 'entityCurrency'},
					CommentText: {key: 'entityCommentText'},
				})
			}
		};
	},

});