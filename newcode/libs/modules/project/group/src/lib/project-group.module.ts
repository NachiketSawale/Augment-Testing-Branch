/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProjectGroupModuleInfo } from './model/project-group-module-info.class';
import { PROJECT_GROUP_VALIDATION_TOKEN, ProjectGroupValidationService } from './services/project-group-validation.service';

const routes: Routes = [new BusinessModuleRoute(ProjectGroupModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: PROJECT_GROUP_VALIDATION_TOKEN, useExisting: ProjectGroupValidationService }
	],
})
export class ProjectGroupModule {}
