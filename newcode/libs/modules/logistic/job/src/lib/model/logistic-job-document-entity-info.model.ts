/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobDocumentDataService } from '../services/logistic-job-document-data.service';
import { IJobDocumentEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticJobDocumentValidationService } from '../services/logistic-job-document-validation.service';


export const LOGISTIC_JOB_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobDocumentEntity>({
	grid: {
		title: {key: 'logistic.job' + '.jobDocumentListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.jobDocumentDetailTitle'},
		containerUuid: '8893ada79e704d60ac11c87235d95c0e',
	},
	dataService: ctx => ctx.injector.get(LogisticJobDocumentDataService),
	validationService: ctx => ctx.injector.get(LogisticJobDocumentValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'JobDocumentDto'},
	permissionUuid: '20e85d49386d410c85988b42e384759f',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Logistic Job Document',
				attributes: ['Description', 'DocumentTypeFk', 'JobDocumentTypeFk', 'Date', 'Barcode'/*,'FileArchiveDocFk'*/],
			},
		],
		overloads: {
			DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
			JobDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobDocumentTypeLookupOverload(true)
			//TODO: FileArchiveDocFk
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				Barcode: {key: 'entityBarcode'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'descriptionInfo'},
				Date: {key: 'entityDate'},
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				DocumentTypeFk: {key: 'documenttype'},
				JobDocumentTypeFk: {key: 'jobdocumenttype'},
			}),
		},
	},
});
