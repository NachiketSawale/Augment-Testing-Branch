/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobPrj2MaterialPriceConditionDataService } from '../services/logistic-job-prj2-material-price-condition-data.service';
import { IProject2MaterialPriceConditionEntity } from '@libs/logistic/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const LOGISTIC_JOB_PRJ2_MATERIAL_PRICE_CONDITION_ENTITY_INFO: EntityInfo = EntityInfo.create<IProject2MaterialPriceConditionEntity>({
	grid: {
		title: {key: 'logistic.job' + '.prjMaterialPriceConditionListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.prjMaterialPriceConditionDetailTitle'},
		containerUuid: '9618d193861547efa8a8b233ed80c00d',
	},
	dataService: ctx => ctx.injector.get(LogisticJobPrj2MaterialPriceConditionDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'Project2MaterialPriceConditionDto'},
	permissionUuid: '89bf60f70caf4d6db646a941b632e40b',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['PriceConditionTypeFk', 'Description', 'Value', 'Total', 'TotalOc', 'IsPriceComponent', 'IsActivated'],
			},
		],
		overloads: {
			PriceConditionTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceConditionTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				PriceConditionTypeFk: {key: 'priceConditionType'},
				IsPriceComponent: {key: 'isPriceComponent'},
				IsActivated: {key: 'isActivated'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {key: 'descriptionInfo'},
				Value: {key: 'priceValue'},
				Total: {key: 'priceTotal'},
				TotalOc: {key: 'priceTotalOc'},
			})
		},
	},
});