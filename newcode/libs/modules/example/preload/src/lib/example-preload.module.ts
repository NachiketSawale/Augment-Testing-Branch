/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ExamplePreloadInfo } from './model/example-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class ExamplePreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ExamplePreloadInfo.instance);
	}
}
