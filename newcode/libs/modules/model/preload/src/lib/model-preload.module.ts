/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ModelPreloadInfo } from './model/model-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class ModelPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ModelPreloadInfo.instance);
	}
}
