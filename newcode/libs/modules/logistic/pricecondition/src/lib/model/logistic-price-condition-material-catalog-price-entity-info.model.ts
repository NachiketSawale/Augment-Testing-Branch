/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionMaterialCatalogPriceDataService } from '../services/logistic-price-condition-material-catalog-price-data.service';
import { ILogisticMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticPriceConditionMaterialCatalogPriceValidationService } from '../services/logistic-price-condition-material-catalog-price-validation.service';


export const LOGISTIC_PRICE_CONDITION_MATERIAL_CATALOG_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticMaterialCatalogPriceEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listMaterialCatalogPriceTitle'},

	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailMaterialCatalogPriceTitle'},
		containerUuid: '00c2aee866bc4607b3824ea4e05700b6',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionMaterialCatalogPriceDataService),
	validationService: (ctx) => ctx.injector.get(LogisticPriceConditionMaterialCatalogPriceValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticMaterialCatalogPriceDto'},
	permissionUuid: 'bd261e0906984702a6d01964ffc58bcc',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['MaterialCatalogFk' ,'MaterialPriceListFk'/*, 'MaterialPriceVersionFk'*/, 'CommentText'],
			}
		],
		overloads: {
			MaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(true),
			MaterialPriceListFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceListLookupOverload(true),
			// MaterialPriceListFk - TO DO
			// MaterialPriceVersionFk - TO DO
		},
		labels: {
			...prefixAllTranslationKeys('logistic.pricecondition.', {
				MaterialCatalogFk: {key: 'entityCatalog'},
				MaterialPriceListFk: {key: 'entityPriceList'},
				MaterialPriceVersionFk: {key: 'entityPriceVersion'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityCommentText'},
			})
		}
	},
});