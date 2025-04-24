/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { DocumentsPreloadInfo } from './model/documents-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class DocumentsPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(new DocumentsPreloadInfo());
	}
}
