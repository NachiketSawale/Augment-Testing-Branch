/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlatformModuleManagerService} from '@libs/platform/common';
import {ResourcePreloadInfo} from './model/resource-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class ResourcePreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ResourcePreloadInfo.instance);
	}
}
