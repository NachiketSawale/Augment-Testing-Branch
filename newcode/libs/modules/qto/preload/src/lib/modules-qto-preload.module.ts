/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { QtoPreloadInfo } from './model/qto-preload-info.class';

@NgModule({
	imports: [CommonModule]
})
export class ModulesQtoPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(QtoPreloadInfo.instance);
	}
}
