/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionMaterialPriceDataService } from '../services/logistic-price-condition-material-price-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILogisticMaterialPriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionMaterialPriceValidationService } from '../services/logistic-price-condition-material-price-validation.service';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';


export const LOGISTIC_PRICE_CONDITION_MATERIAL_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticMaterialPriceEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listMaterialPriceTitle'},

	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailMaterialPriceTitle'},
		containerUuid: '39f4db632f194d0bb918fc8981f1011e',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionMaterialPriceDataService),
	validationService: (ctx) => ctx.injector.get(LogisticPriceConditionMaterialPriceValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticMaterialPriceDto'},
	permissionUuid: 'ef3955379c4447a3bda9264908229c8b',
	layoutConfiguration: async context => {
		const basicsCurrencyLookupProvider = await context.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['MaterialCatalogFk', 'MaterialFk', 'CurrencyFk', 'Price', 'ValidFrom', 'ValidTo', 'CommentText','Uom'],
				}
			],
			overloads: {
				MaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(true),
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
				CurrencyFk: basicsCurrencyLookupProvider.provideCurrencyLookupOverload({showClearButton: true}),
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					Uom: {key: 'uom'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'},
					MaterialCatalogFk: {key: 'entityMaterialCatalog'},
					CurrencyFk: {key: 'entityCurrency'},
					ValidFrom: {key: 'entityValidFrom'},
					ValidTo: {key: 'entityValidTo'},
					Price: {key: 'entityPrice'},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					MaterialFk: {key: 'record.material', text: 'Material'},
				})
			}
		};
	},
});