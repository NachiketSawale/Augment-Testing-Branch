/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@libs/ui/common';
import {RouterModule, Routes} from '@angular/router';
import {ContainerModuleRoute} from '@libs/ui/container-system';
import {DocumentsImportModuleInfo} from './model/documents-import-module-info.class';
import {DOCUMENT_IMPORT_BEHAVIOR_TOKEN, DocumentsInportBehavior} from './behavior/documents-inport-behavior.service';
import { DOCUMENT_IMPORT_TASK_BEHAVIOR_TOKEN, DocumentsImportTaskBehavior } from './behavior/documents-import-task-behavior.service';
import { DOCUMENT_IMPORT_LOGGING_BEHAVIOR_TOKEN, DocumentsImportLoggingBehavior } from './behavior/documents-import-logging-behavior.service';

const routes: Routes = [new ContainerModuleRoute(DocumentsImportModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{
			provide:DOCUMENT_IMPORT_BEHAVIOR_TOKEN,useExisting:DocumentsInportBehavior
		},
		{
			provide:DOCUMENT_IMPORT_TASK_BEHAVIOR_TOKEN,useExisting:DocumentsImportTaskBehavior
		},
		{
			provide:DOCUMENT_IMPORT_LOGGING_BEHAVIOR_TOKEN,useExisting:DocumentsImportLoggingBehavior
		}
	],
})
export class DocumentsImportModule {}