/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectDropPointsModuleInfo } from './model/project-drop-points-module-info.class';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(new ProjectDropPointsModuleInfo())];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: []
})
export class ProjectDropPointsModule {}