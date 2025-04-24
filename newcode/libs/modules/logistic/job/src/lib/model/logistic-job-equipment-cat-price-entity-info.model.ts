/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { LogisticJobEquipmentCatPriceDataService } from '../services/logistic-job-equipment-cat-price-data.service';
import { ILogisticEquipmentCatalogPriceEntity } from '@libs/logistic/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticJobEquipmentCatPriceValidationService } from '../services/logistic-job-equipment-cat-price-validation.service';


export const LOGISTIC_JOB_EQUIPMENT_CAT_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticEquipmentCatalogPriceEntity>({
	grid: {
		title: {key: 'logistic.job' + '.equipmentCatPriceListTitle'},

	},
	form: {
		title: {key: 'logistic.job' + '.equipmentCatPriceDetailTitle'},
		containerUuid: '1f657746606c440fbac058367512dcef',
	},
	dataService: ctx => ctx.injector.get(LogisticJobEquipmentCatPriceDataService),
	validationService: ctx => ctx.injector.get(LogisticJobEquipmentCatPriceValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticEquipmentCatalogPriceDto'},
	permissionUuid: '361273dab16942fa97c7c51b43b9d361',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['JobPerformingFk', 'EquipmentPriceListFk', 'CommentText', 'EvaluationOrder'],
			},
		],
		overloads: {
			EquipmentPriceListFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentPriceListLookupOverload(true),
			//TODO: JobPerformingFk
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				JobPerformingFk: {key: 'entityJobPerforming'},
				EquipmentPriceListFk: {key: 'equipmentPriceList'},
				EvaluationOrder: {key: 'evaluationOrder'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityCommentText'},
			})
		},
	},
});
