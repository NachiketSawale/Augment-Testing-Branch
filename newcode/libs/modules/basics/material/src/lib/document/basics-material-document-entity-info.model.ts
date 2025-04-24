/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DocumentBasicLayoutService, DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { BasicsMaterialDocumentDataService } from './basics-material-document-data.service';
import { IMaterialDocumentEntity } from '../model/entities/material-document-entity.interface';


export const BASICS_MATERIAL_DOCUMENT_ENTITY_INFO = EntityInfo.create<IMaterialDocumentEntity>({
	grid: {
		title: { text: 'Document', key: 'basics.material.documents.title' },
		behavior: ctx => new DocumentsSharedBehaviorService<IMaterialDocumentEntity>(ctx.injector.get(BasicsMaterialDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: 'cd7be1a005da4c199e84369963d464e9',
		title: { text: 'Document Detail', key: 'basics.material.documents.detailTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialDocumentDataService),
	permissionUuid: 'c84bd59dda4b4644aae314e1a5a11a0c',
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MaterialDocumentDto' },
	layoutConfiguration: context =>
		context.injector.get(DocumentBasicLayoutService).generateLayout<IMaterialDocumentEntity>()
});