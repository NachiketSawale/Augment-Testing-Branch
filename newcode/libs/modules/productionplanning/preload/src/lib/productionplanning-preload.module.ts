/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ProductionPlanningPreloadInfo } from './model/productionplanning-preload-info.class';


@NgModule({
	imports: [CommonModule],
})
export class ProductionPlanningPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(ProductionPlanningPreloadInfo.instance);
	}
}
