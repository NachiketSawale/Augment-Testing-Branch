/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ControllingActualsModuleInfo } from './model/controlling-actuals-module-info.class';
import { CONTROLLING_ACTUALS_COST_HEADER_DATA_TOKEN, ControllingActualsCostHeaderDataService } from './services/controlling-actuals-cost-header-data.service';
import { CONTROLLING_ACTUALS_COST_DATA_DATA_TOKEN, ControllingActualsCostDataDataService } from './services/controlling-actuals-cost-data-data.service';

const routes: Routes = [new BusinessModuleRoute(ControllingActualsModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: CONTROLLING_ACTUALS_COST_HEADER_DATA_TOKEN, useExisting: ControllingActualsCostHeaderDataService},
		{provide: CONTROLLING_ACTUALS_COST_DATA_DATA_TOKEN, useExisting: ControllingActualsCostDataDataService},
	],
})
export class ControllingActualsModule {}
