/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardTemplateDocumentDataService } from '../services/data/logistic-card-template-job-card-template-document-data.service';
import { LogisticCardTemplateJobCardTemplateDocumentValidationService } from '../services/validation/logistic-card-template-job-card-template-document-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ILogisticCardTemplateJobCardTemplateDocumentEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_DOCUMENT_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'JobCardTemplateDocument',
			key: 'logistic.cardtemplate.cardTemplateDocumentListTitle'
		}
	},
	form: {
		title: {
			text: 'JobCardTemplateDocument',
			key: 'logistic.cardtemplate.cardTemplateDocumentDetailTitle'
		},
		containerUuid: '125101fddb83457a95064b25bb7ff6d0'
	},
	dataService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardTemplateDocumentDataService),
	validationService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardTemplateDocumentValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Logistic.CardTemplate',
		typeName: 'JobCardTemplateDocumentDto'
	},
	permissionUuid: 'da8c50f95eab426ea365f50e28794eb6',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<ILogisticCardTemplateJobCardTemplateDocumentEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Description',
						'JobCardDocumentTypeFk',
						'DocumentTypeFk',
						'Date',
						'Barcode',
						'FileArchiveDocFk',
						'Url',
					]
				},
			],
			overloads: {
				JobCardDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardDocumentTypeLookupOverload(true),
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true)
			},
			labels: { 
				...prefixAllTranslationKeys('logistic.cardtemplate.', {
					Description: { key: 'cardRecordDescription' },
					JobCardDocumentTypeFk: { key: 'jobCardDocumentTypeFk' },
					Barcode: { key: 'barcode' },
					FileArchiveDocFk: { key: 'fileArchiveDocFk' },
					Url: { key: 'url' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DocumentTypeFk: { key: 'entityType' },
					Date: { key: 'entityDate' }
				}),
			 }
		};
	}
});