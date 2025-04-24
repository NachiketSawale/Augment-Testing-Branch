/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { HsqeChecklistDocumentValidationService } from '../../services/validations/hsqe-checklist-document-validation.service';
import { HsqeChecklistDocumentDataService } from '../../services/hsqe-checklist-document-data.service';
import { IHsqCheckListDocumentEntity } from '@libs/hsqe/interfaces';

export const HSQE_CHECKLIST_DOCUMENT_ENTITY_INFO = EntityInfo.create<IHsqCheckListDocumentEntity>({
	grid: {
		title: { text: 'Document', key: 'hsqe.checklist.documentGridTitle' },
		behavior: (ctx) => new DocumentsSharedBehaviorService<IHsqCheckListDocumentEntity>(ctx.injector.get(HsqeChecklistDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: 'd4d5152b4fbd4cf58559a1ffbb32ed86',
		title: { text: 'Document Detail', key: 'defect.main.documentDetailTitle' }, //copied from old client.
	},
	dataService: (ctx) => ctx.injector.get(HsqeChecklistDocumentDataService),
	validationService: (ctx) => ctx.injector.get(HsqeChecklistDocumentValidationService),
	permissionUuid: 'b87bb8f86135487d8fb332dedf43d183',
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckList', typeName: 'HsqCheckListDocumentDto' },
	layoutConfiguration: (context) =>
		context.injector.get(DocumentBasicLayoutService).generateLayout<IHsqCheckListDocumentEntity>({
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['CommentText'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityCommentText', text: 'Comment' },
				}),
			},
		}),
});
