/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobSundryServicePriceDataService } from '../services/logistic-job-sundry-service-price-data.service';
import { ILogisticJobSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const LOGISTIC_JOB_SUNDRY_SERVICE_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticJobSundryServicePriceEntity>({
	grid: {
		title: {key: 'logistic.job' + '.sundryServicePriceListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.sundryServicePriceDetailTitle'},
		containerUuid: '0d5b4fcb1a204c9ab52e75bec5561bde',
	},
	dataService: ctx => ctx.injector.get(LogisticJobSundryServicePriceDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticSundryServicePriceDto'},
	permissionUuid: 'd7891ba1840c4b82959112b06d70afab',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['SundryServiceFk', 'CommentText', 'JobPerformingFk', 'IsManual', 'PricePortion1', 'PricePortion2', 'PricePortion3', 'PricePortion4', 'PricePortion5', 'PricePortion6',
					'ValidFrom', 'ValidTo'],
			},
		],
		overloads: {
			//TODO:SundryServiceFk
			//TODO:JobPerformingFk
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				SundryServiceFk: {key: 'sundryServiceFk'},
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