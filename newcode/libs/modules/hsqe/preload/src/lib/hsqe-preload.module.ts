/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { HsqePreloadInfo } from './model/hsqe-preload-info.class';

/**
 * This class initializes the `hsqe` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class HsqePreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(HsqePreloadInfo.instance);
	}
}
