/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IDocumentImportedLogInfo } from '../entities/document-info.interface';
import { DocumentsImportLoggingDataService } from '../../service/documents-import-logging-data.service';
import { DocumentsImportLoggingLayoutService } from '../../service/documents-import-logging-layout.service';
import { DOCUMENT_IMPORT_LOGGING_BEHAVIOR_TOKEN } from '../../behavior/documents-import-logging-behavior.service';

export const DOCUMENTS_IMPORT_LOGGING_ENTITY_INFO = EntityInfo.create<IDocumentImportedLogInfo>({
	grid: {
		title: { text: 'Import Logging', key: 'documents.import.result' },
		behavior : DOCUMENT_IMPORT_LOGGING_BEHAVIOR_TOKEN
	},
	dataService: ctx => ctx.injector.get(DocumentsImportLoggingDataService),
	dtoSchemeId: { moduleSubModule: 'Documents.Import', typeName: 'DocumentImportResultDto' },
	permissionUuid: 'fa4119c484e7423082cf6d6f3596abf4',
	layoutConfiguration: context => {
		return context.injector.get(DocumentsImportLoggingLayoutService).generateConfig();
	}
});