/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobMaterialCatPriceDataService } from '../services/logistic-job-material-cat-price-data.service';
import { ILogisticJobMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticJobMaterialCatPriceValidationService } from '../services/logistic-job-material-cat-price-validation.service';



export const LOGISTIC_JOB_MATERIAL_CAT_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticJobMaterialCatalogPriceEntity>({
	grid: {
		title: {key: 'logistic.job' + '.materialCatPriceListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.materialCatPriceDetailTitle'},
		containerUuid: '2f3c295af8024ecc8f8fd55518417e84',
	},
	dataService: ctx => ctx.injector.get(LogisticJobMaterialCatPriceDataService),
	validationService: ctx => ctx.injector.get(LogisticJobMaterialCatPriceValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticMaterialCatalogPriceDto'},
	permissionUuid: '01f5e790a9e9416da8f7c4171e9ece5d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [/*'JobPerformingFk', 'MaterialCatalogFk', */'MaterialPriceListFk'/*, 'MaterialPriceVersionFk'*/, 'CommentText'],
			},
		],
		overloads: {
			MaterialPriceListFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceListLookupOverload(true),
			//TODO: JobPerformingFk
			//TODO: MaterialCatalogFk
			//TODO:MaterialPriceVersionFk
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				//JobPerformingFk: {key: 'entityJobPerforming'},
				//MaterialCatalogFk: {key: 'materialCatalog'},
				MaterialPriceListFk: {key: 'entityMaterialPriceList'},
				//MaterialPriceVersionFk: {key: 'materialPriceVersion'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityCommentText'},
			})
		},
	},
});
