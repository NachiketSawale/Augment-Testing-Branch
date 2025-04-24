/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { HsqeChecklisttemplateModuleInfo } from './model/hsqe-checklisttemplate-module-info.class';

const routes: Routes = [new BusinessModuleRoute(HsqeChecklisttemplateModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class HsqeChecklisttemplateModule {}
