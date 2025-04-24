/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { ServicesPreloadInfo } from './model/services-preload-info.class';

/**
 * This class initializes the `services` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class ServicesPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ServicesPreloadInfo.instance);
	}
}
