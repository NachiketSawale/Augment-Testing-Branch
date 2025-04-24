/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformModuleManagerService } from '@libs/platform/common';
import { WebapiPreloadInfo } from './model/webapi-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class WebApiHelpPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(WebapiPreloadInfo.instance);
	}
}
