/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { EstimateCommonModuleInfo } from './model/estimate-common-module-info.class';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(EstimateCommonModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
	exports:[]
})
export class EstimateCommonModule {}
