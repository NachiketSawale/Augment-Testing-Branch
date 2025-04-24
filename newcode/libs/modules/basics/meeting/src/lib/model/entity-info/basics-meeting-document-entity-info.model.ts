/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { IMtgDocumentEntity } from '@libs/basics/interfaces';
import { BasicsMeetingDocumentDataService } from '../../services/basics-meeting-document-data.service';
import { BasicsMeetingDocumentValidationService } from '../../services/validations/basics-meeting-document-validation.service';

export const BASICS_MEETING_DOCUMENT_ENTITY_INFO = EntityInfo.create<IMtgDocumentEntity>({
	grid: {
		title: { text: 'Document', key: 'basics.meeting.documents.title' },
		behavior: (ctx) => new DocumentsSharedBehaviorService<IMtgDocumentEntity>(ctx.injector.get(BasicsMeetingDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: '258b33bab3cd46648116526f26d56a7c',
		title: { text: 'Document Detail', key: 'basics.meeting.documents.detailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMeetingDocumentDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMeetingDocumentValidationService),
	permissionUuid: '4a764165f16f43b38cdd272bb51ed3a1',
	dtoSchemeId: { moduleSubModule: 'Basics.Meeting', typeName: 'MtgDocumentDto' },
	layoutConfiguration: (context) => context.injector.get(DocumentBasicLayoutService).generateLayout<IMtgDocumentEntity>(),
});
