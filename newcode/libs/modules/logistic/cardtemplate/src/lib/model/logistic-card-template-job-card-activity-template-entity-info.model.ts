/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardActivityTemplateDataService } from '../services/data/logistic-card-template-job-card-activity-template-data.service';
import { LogisticCardTemplateJobCardActivityTemplateValidationService } from '../services/validation/logistic-card-template-job-card-activity-template-validation.service';
import { ILogisticCardTemplateJobCardActivityTemplateEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const LOGISTIC_CARD_TEMPLATE_JOB_CARD_ACTIVITY_TEMPLATE_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'JobCardActivityTemplate',
			key: 'logistic.cardtemplate.cardTemplateActivityListTitle'
		}
	},
	form: {
		title: {
			text: 'JobCardActivityTemplate',
			key: 'logistic.cardtemplate.cardTemplateActivityDetailTitle'
		},
		containerUuid: 'ef003b81dcd2411a8bad42476fb2bf87'
	},
	dataService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardActivityTemplateDataService),
	validationService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardActivityTemplateValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Logistic.CardTemplate',
		typeName: 'JobCardActivityTemplateDto'
	},
	permissionUuid: '0df6e4b981e146648d61eced666a6619',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<ILogisticCardTemplateJobCardActivityTemplateEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Code',
						'DescriptionInfo',
						'Comment',
						'Remark',
					]
				},
			],
			overloads: {},
			labels: { 
				...prefixAllTranslationKeys('logistic.cardtemplate.', {
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescriptionInfo' },
					Comment: { key: 'entityComment' },
					Remark: { key: 'entityRemark' }
				}),
			 }
		};
	}
});