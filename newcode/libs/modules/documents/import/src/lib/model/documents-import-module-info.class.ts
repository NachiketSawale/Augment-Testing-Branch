/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';
import {DOCUMENTS_IMPORT_ENTITY_INFO} from './entity-info/documents-import-entity-info.model';
import { DOCUMENTS_IMPORT_TASK_ENTITY_INFO } from './entity-info/documents-import-task-entity-info.model';
import { Injector } from '@angular/core';
import { DocumentsImportTaskDataService } from '../service/documents-import-task-data.service';
import { DOCUMENTS_IMPORT_LOGGING_ENTITY_INFO } from './entity-info/documents-import-logging-entity-info.model';

export class DocumentsImportModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new DocumentsImportModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}
	public override get internalModuleName(): string {
		return 'documents.import';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Documents.Import';
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		const documentsImportTaskDataService = injector.get(DocumentsImportTaskDataService);
		documentsImportTaskDataService.loadData();
	}

	public override get entities(): EntityInfo[] {
		return [
			DOCUMENTS_IMPORT_ENTITY_INFO,
			DOCUMENTS_IMPORT_TASK_ENTITY_INFO,
			DOCUMENTS_IMPORT_LOGGING_ENTITY_INFO
		];
	}

}
