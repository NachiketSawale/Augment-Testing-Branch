/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';

import { IPrcStructureDocEntity } from '../model/entities/prc-structure-doc-entity.interface';
import { BasicsProcurementStructureDocumentDataService } from './basics-procurement-structure-document-data.service';
import { BasicsProcurementStructureDocumentLayoutService } from './basics-procurement-structure-document-layout.service';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';

export const PROCUREMENT_STRUCTURE_DOCUMENT_ENTITY_INFO = EntityInfo.create<IPrcStructureDocEntity>({
	dtoSchemeId: { moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructureDocDto' },
	permissionUuid: '199686a8c6a14a82a4f4830815409008',
	grid: {
		title: { key: 'basics.procurementstructure.documentContainerTitle' },
		behavior: (ctx) => new DocumentsSharedBehaviorService<IPrcStructureDocEntity>(ctx.injector.get(BasicsProcurementStructureDocumentDataService), ctx.injector),
	},
	form: {
		containerUuid: '68036876fb1249e796e8467f63903e9c',
		title: { key: 'basics.procurementstructure.documentDetailContainerTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsProcurementStructureDocumentDataService),
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsProcurementStructureDocumentLayoutService).generateLayout();
	},
});
