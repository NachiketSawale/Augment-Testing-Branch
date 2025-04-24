/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobCostcodeRateDataService } from '../services/logistic-job-costcode-rate-data.service';
import { ILogisticJobCostCodeRateEntity } from '@libs/logistic/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticJobCostCodeRateValidationService } from '../services/logistic-job-cost-code-rate-validation.service';


export const LOGISTIC_JOB_COST_CODE_RATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticJobCostCodeRateEntity>({
	grid: {
		title: {key: 'logistic.job' + '.costCodeRateListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.costCodeRateDetailTitle'},
		containerUuid: 'bf85675ae414422f91d2a916a418b447',
	},
	dataService: ctx => ctx.injector.get(LogisticJobCostcodeRateDataService),
	validationService: ctx => ctx.injector.get(LogisticJobCostCodeRateValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'LogisticCostCodeRateDto'},
	permissionUuid: 'd106505776d14f8c9f4737b18370b2cb',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Rate', 'SalesPrice', 'CurrencyFk', 'CommentText'],
			},
		],
		overloads: {
			CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CurrencyFk: {key: 'entityCurrency'},
				CommentText: {key: 'entityCommentText'},
			}),
			...prefixAllTranslationKeys('logistic.common.', {
				Rate: {key: 'costCodeRate'},
			}),
			...prefixAllTranslationKeys('basics.costcodes.', {
				SalesPrice: {key: 'priceList.salesPrice'},
			})
		},
	},
});
