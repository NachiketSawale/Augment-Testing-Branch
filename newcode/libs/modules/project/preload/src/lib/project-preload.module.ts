/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ProjectPreloadInfo } from './model/project-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class ProjectPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ProjectPreloadInfo.instance);
	}
}
