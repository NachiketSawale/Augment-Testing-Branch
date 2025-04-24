/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ControllingProjectcontrolsModuleInfo } from './model/controlling-projectcontrols-module-info.class';
import { CONTROLLING_PROJECTCONTROLS_PROJECT_MAIN_DATA_TOKEN, ControllingProjectControlsProjectDataService } from './services/controlling-projectcontrols-project-main-data.service';
import { ControllingProjectControlsChartContainerComponent } from './components/chart-container/chart-container.component';
import { BasicsSharedModule } from '@libs/basics/shared';
import { ControllingProjectControlsDashobardContainerComponent } from './components/dashboard/dashboard-container.component';
import { ControllingProjectControlsDashobardStructureComponent } from './components/dashboard-structure/dashboard-structure.component';

const routes: Routes = [new BusinessModuleRoute(ControllingProjectcontrolsModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, BasicsSharedModule, GridComponent],
	declarations: [ControllingProjectControlsChartContainerComponent, ControllingProjectControlsDashobardStructureComponent, ControllingProjectControlsDashobardContainerComponent],
	providers: [{ provide: CONTROLLING_PROJECTCONTROLS_PROJECT_MAIN_DATA_TOKEN, useExisting: ControllingProjectControlsProjectDataService }],
})
export class ControllingProjectcontrolsModule {}
