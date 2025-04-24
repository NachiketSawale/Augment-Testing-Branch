/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { CloudPreloadInfo } from './model/cloud-preload-info.class';

/**
 * This class initializes the `cloud` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class CloudPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(CloudPreloadInfo.instance);
	}
}
