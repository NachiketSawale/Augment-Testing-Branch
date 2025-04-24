/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';

import { SchedulingPreloadInfo } from './model/scheduling-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class SchedulingPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(SchedulingPreloadInfo.instance);
	}
}
