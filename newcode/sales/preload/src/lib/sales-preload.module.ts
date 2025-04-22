/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { SalesPreloadInfo } from './model/sales-preload-info.class';

/**
 * This class initializes the `sales` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class SalesPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(SalesPreloadInfo.instance);
	}
}
