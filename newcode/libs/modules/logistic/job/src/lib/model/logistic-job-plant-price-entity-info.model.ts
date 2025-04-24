/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobPlantPriceDataService } from '../services/logistic-job-plant-price-data.service';
import { ILogisticJobPlantPriceEntity } from '@libs/logistic/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';


export const LOGISTIC_JOB_PLANT_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticJobPlantPriceEntity>({
	grid: {
		title: {key: 'logistic.job' + '.costCodeRateListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.plantPriceDetailTitle'},
		containerUuid: '4c30f0a003a047eea2528d8c44eddbde',
	},
	dataService: ctx => ctx.injector.get(LogisticJobPlantPriceDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticPlantPriceDto'},
	permissionUuid: 'e8ceec4dc6d54974a27159588c65962d',

	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['PlantFk', 'JobPerformingFk', 'WorkOperationTypeFk', 'IsManual', 'UomFk', 'PricePortion1', 'PricePortion2', 'PricePortion3', 'PricePortion4', 'PricePortion5', 'PricePortion6',
					'ValidFrom', 'ValidTo', 'CommentText'],
			},
		],
		overloads: {
			//TODO:PlantFk
			//TODO:JobPerformingFk
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeReadonlyLookupOverload(),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)

		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				PlantFk: {key: 'plant'},
				JobPerformingFk: {key: 'entityJobPerforming'},
				WorkOperationTypeFk: {key: 'workOperationType'},
				IsManual: {key: 'isManual'},
				PricePortion1: {key: 'pricePortion1'},
				PricePortion2: {key: 'pricePortion2'},
				PricePortion3: {key: 'pricePortion3'},
				PricePortion4: {key: 'pricePortion4'},
				PricePortion5: {key: 'pricePortion5'},
				PricePortion6: {key: 'pricePortion6'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				UomFk: {key: 'entityUoM'},
				CommentText: {key: 'entityCommentText'},
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'},
			})
		},
	},
});