/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { BoqPreloadInfo } from './model/boq-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class BoqPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule( BoqPreloadInfo.instance);
	}
}
