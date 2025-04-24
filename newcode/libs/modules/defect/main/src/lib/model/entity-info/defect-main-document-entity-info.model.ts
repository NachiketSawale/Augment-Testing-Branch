/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { DefectMainDocumentValidationService } from '../../services/validations/defect-main-document-validation.service';
import { DefectMainDocumentDataService } from '../../services/defect-main-document-data.service';
import { IDfmDocumentEntity } from '../entities/dfm-document-entity.interface';

export const DEFECT_MAIN_DOCUMENT_ENTITY_INFO = EntityInfo.create<IDfmDocumentEntity>({
	grid: {
		title: { text: 'Document', key: 'defect.main.documentGridTitle' },
		behavior: (ctx) => new DocumentsSharedBehaviorService<IDfmDocumentEntity>(ctx.injector.get(DefectMainDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: '5b5b35364b3d419ba34e78f664b4234f',
		title: { text: 'Document Detail', key: 'defect.main.documentDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(DefectMainDocumentDataService),
	validationService: (ctx) => ctx.injector.get(DefectMainDocumentValidationService),
	permissionUuid: 'cf8fbeb95cf24fcf98730a4817241201',
	dtoSchemeId: { moduleSubModule: 'Defect.Main', typeName: 'DfmDocumentDto' },
	layoutConfiguration: (context) =>
		context.injector.get(DocumentBasicLayoutService).generateLayout<IDfmDocumentEntity>({
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['DfmDocumenttypeFk'],
				},
			],
			overloads: {
				DfmDocumenttypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDefectDocumentTypeLookupOverload(false),
			},
			labels: {
				...prefixAllTranslationKeys('defect.main.', {
					DfmDocumenttypeFk: { key: 'entityDefectType', text: 'Defect Document Type' },
				}),
			},
		}),
});
