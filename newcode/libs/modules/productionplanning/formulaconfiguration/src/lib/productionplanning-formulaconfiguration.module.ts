/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ProductionplanningFormulaconfigurationModuleInfo } from './model/productionplanning-formulaconfiguration-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningFormulaconfigurationModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
})
export class ProductionplanningFormulaconfigurationModule { }
