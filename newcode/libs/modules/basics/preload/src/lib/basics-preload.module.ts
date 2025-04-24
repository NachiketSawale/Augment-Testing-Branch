/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { RouterModule, Routes } from '@angular/router';

import { BasicsPreloadInfo } from './model/basics-preload-info.class';

const routes: Routes = [
	{
		path: 'clerk',
		loadChildren: () => import('@libs/basics/clerk').then((module) => module.BasicsClerkModule)
	}
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BasicsPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(BasicsPreloadInfo.instance);
	}
}
