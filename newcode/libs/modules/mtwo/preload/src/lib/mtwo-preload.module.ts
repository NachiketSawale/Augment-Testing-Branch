/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { MtwoPreloadInfo } from './model/mtwo-preload-info.class';

/**
 * This class initializes the `mtwo` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class MtwoPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(MtwoPreloadInfo.instance);
	}
}
