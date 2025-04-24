/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { UsermanagementPreloadInfo } from './model/usermanagement-preload-info.class';

/**
 * This class initializes the `usermanagement` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class UsermanagementPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(UsermanagementPreloadInfo.instance);
	}
}
