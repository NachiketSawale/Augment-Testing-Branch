/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardTemplateDataService } from '../services/data/logistic-card-template-job-card-template-data.service';
import { LogisticCardTemplateJobCardTemplateValidationService } from '../services/validation/logistic-card-template-job-card-template-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ILogisticCardTemplateJobCardTemplateEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'JobCardTemplate',
			key: 'logistic.cardtemplate.cardTemplateListTitle'
		}
	},
	form: {
		title: {
			text: 'JobCardTemplate',
			key: 'logistic.cardtemplate.cardTemplateDetailTitle'
		},
		containerUuid: '29cad0ea85ce4611b194e118fb0c350f'
	},
	dataService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardTemplateDataService),
	validationService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardTemplateValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Logistic.CardTemplate',
		typeName: 'JobCardTemplateDto'
	},
	permissionUuid: 'e0fffc91d92b4bdda85c9f39679f417c',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<ILogisticCardTemplateJobCardTemplateEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Code',
						'DescriptionInfo',
						'Comment',
						'Remark',
						'WorkOperationTypeFk',
						//'ResourceFk',
						'RubricCategoryFk',
					]
				},
			],
			overloads: {
				WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(true),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true)
			},
			labels: { 
				...prefixAllTranslationKeys('logistic.cardtemplate.', {
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescriptionInfo' },
					Comment: { key: 'entityComment' },
					Remark: { key: 'entityRemark' },
					WorkOperationTypeFk: { key: 'workOperationTypeFk' },
					ResourceFk: { key: 'entitiyResource' },
					RubricCategoryFk: { key: 'rubricCategory' }
				}),
			 }
		};
	}
});