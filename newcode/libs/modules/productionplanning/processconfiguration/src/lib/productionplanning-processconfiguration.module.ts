/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';

import { ProductionplanningProcessconfigurationModuleInfo } from './model/productionplanning-processconfiguration-module-info.class';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new ContainerModuleRoute(ProductionplanningProcessconfigurationModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
})
export class ProductionplanningProcessconfigurationModule {}
