/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { EstimateParameterModuleInfo } from './model/estimate-parameter-module-info.class';
import { ESTIMATE_PARAMETER_PRJ_PARAM_DATA_TOKEN, EstimateParameterPrjParamDataService } from './services/estimate-parameter-prj-param-data.service';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(EstimateParameterModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: ESTIMATE_PARAMETER_PRJ_PARAM_DATA_TOKEN, useExisting: EstimateParameterPrjParamDataService }		
	]
})
export class EstimateParameterModule {}
