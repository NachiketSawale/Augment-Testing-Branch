/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { TransportplanningPreloadInfo } from './model/transportplanning-preload-info.class';

/**
 * This class initializes the `transportplanning` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class TransportplanningPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(TransportplanningPreloadInfo.instance);
	}
}
