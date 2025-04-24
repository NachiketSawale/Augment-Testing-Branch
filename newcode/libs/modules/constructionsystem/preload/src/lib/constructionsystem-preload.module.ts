/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { ConstructionsystemPreloadInfo } from './model/constructionsystem-preload-info.class';

/**
 * This class initializes the `constructionsystem` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class ConstructionsystemPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ConstructionsystemPreloadInfo.instance);
	}
}
