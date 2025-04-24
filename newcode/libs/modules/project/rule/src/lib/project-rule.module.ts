/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ProjectRuleModuleInfo } from './model/project-rule-module-info.class';
import {UiCommonModule} from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(ProjectRuleModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule]
,
})
export class ProjectRuleModule {}
