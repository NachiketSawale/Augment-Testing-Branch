/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { IPrrDocumentEntity } from '../model/entities/prr-document-entity.interface';
import { ControllingRevenueRecognitionDocumentDataService } from './revenue-recognition-document-data.service';

export const REVENUE_RECOGNITION_DOCUMENT_ENTITY_INFO = EntityInfo.create<IPrrDocumentEntity>({
	grid: {
		title: {text: 'Document', key: 'controlling.revrecognition.documentListTitle'},
		behavior: ctx => new DocumentsSharedBehaviorService<IPrrDocumentEntity>(ctx.injector.get(ControllingRevenueRecognitionDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: 'b4a0d29617464d4d84116abada3d16c0',
		title: {text: 'Document Detail', key: 'controlling.revrecognition.documentDetailTitle'},
	},
	dataService: ctx => ctx.injector.get(ControllingRevenueRecognitionDocumentDataService),
	permissionUuid: 'ee935053b6294d1e957bd8942edfb728',
	dtoSchemeId: {moduleSubModule: 'Controlling.RevRecognition', typeName: 'PrrDocumentDto'},
	layoutConfiguration: context =>
		context.injector.get(DocumentBasicLayoutService).generateLayout<IPrrDocumentEntity>()
});