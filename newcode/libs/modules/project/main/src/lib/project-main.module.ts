/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ProjectMainModuleInfo } from './model/project-main-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { ESTIMATE_PROJECT_BEHAVIOR_TOKEN, ESTIMATE_PROJECT_DATA_TOKEN, EstimateProjectBehavior, EstimateProjectDataService } from '@libs/estimate/project';
import { PROJECT_PRICE_CONDITION_PARAM_DATA_TOKEN, ProjectMaterialsPriceConditionParamDataService } from '@libs/project/material';



const routes: Routes = [new BusinessModuleRoute(ProjectMainModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{provide: ESTIMATE_PROJECT_DATA_TOKEN, useExisting: EstimateProjectDataService},
		{provide: ESTIMATE_PROJECT_BEHAVIOR_TOKEN, useExisting: EstimateProjectBehavior},
		{provide: PROJECT_PRICE_CONDITION_PARAM_DATA_TOKEN, useExisting:ProjectMaterialsPriceConditionParamDataService},
	]
})
export class ProjectMainModule {
}
