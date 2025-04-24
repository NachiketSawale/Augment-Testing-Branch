/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { EstimatePreloadInfo } from './model/estimate-preload-info.class';

/**
 * This class initializes the `estimate` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class EstimatePreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(EstimatePreloadInfo.instance);
	}
}
