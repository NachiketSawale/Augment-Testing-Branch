/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { DefectMainModuleInfo } from './model/defect-main-module-info.class';

const routes: Routes = [new BusinessModuleRoute(DefectMainModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class DefectMainModule {}
