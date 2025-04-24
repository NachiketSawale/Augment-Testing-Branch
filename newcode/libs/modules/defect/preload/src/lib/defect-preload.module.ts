/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { DefectPreloadInfo } from './model/defect-preload-info.class';

/**
 * This class initializes the `defect` preload module.
 */
@NgModule({
	imports: [CommonModule],
})
export class DefectPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(DefectPreloadInfo.instance);
	}
}
