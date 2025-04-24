/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { DocumentsImportTaskDataService } from '../../service/documents-import-task-data.service';
import { IDocumentImportJob } from '../entities/document-import-job.interface';
import { DocumentsImportTaskLayoutService } from '../../service/documents-import-task-layout.service';
import { DOCUMENT_IMPORT_TASK_BEHAVIOR_TOKEN } from '../../behavior/documents-import-task-behavior.service';

export const DOCUMENTS_IMPORT_TASK_ENTITY_INFO = EntityInfo.create<IDocumentImportJob>({
	grid: {
		title: { text: 'Document Import', key: 'documents.import.importTask' },
		behavior : DOCUMENT_IMPORT_TASK_BEHAVIOR_TOKEN
	},
	dataService: ctx => ctx.injector.get(DocumentsImportTaskDataService),
	dtoSchemeId: { moduleSubModule: 'Documents.Import', typeName: 'DocumentImportJobDto' },
	permissionUuid: '9800a128218r4098b160294f4ac696da',
	layoutConfiguration: context => {
		return context.injector.get(DocumentsImportTaskLayoutService).generateConfig();
	}
});