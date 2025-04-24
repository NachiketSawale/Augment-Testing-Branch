/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionEquipmentCatalogPriceDataService } from '../services/logistic-price-condition-equipment-catalog-price-data.service';
import { ILogisticEquipCatalogPriceEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticPriceConditionEquipmentCatalogPriceValidationService } from '../services/logistic-price-condition-equipment-catalog-price-validation.service';


export const LOGISTIC_PRICE_CONDITION_EQUIPMENT_CATALOG_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticEquipCatalogPriceEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listEquipmentCatalogPriceTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailEquipmentCatalogPriceTitle'},
		containerUuid: '6e88700ea7a54efe805436ee4272ba99',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionEquipmentCatalogPriceDataService),
	validationService: (ctx) => ctx.injector.get(LogisticPriceConditionEquipmentCatalogPriceValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticEquipCatalogPriceDto'},
	permissionUuid: 'bc736a161cc248eaad95db451e06b541',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['EquipmentPriceListFk','CommentText', 'EvaluationOrder'],
			}
		],
		overloads: {
			EquipmentPriceListFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentPriceListLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.pricecondition.', {
				EquipmentPriceListFk:{key:'entityPriceList'},
				EvaluationOrder: {key: 'evaluationOrder'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityCommentText'},
			})
		}
	},
});