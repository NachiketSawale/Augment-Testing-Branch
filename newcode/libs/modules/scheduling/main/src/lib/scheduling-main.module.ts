/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { SchedulingMainModuleInfo } from './model/scheduling-main-module-info.class';
import { SchedulingMainDeleteBaselineDialogComponent } from './components/scheduling-main-delete-baseline-dialog.component';
import { SchedulingMainCreateBaselineGridDialogComponent } from './components/scheduling-main-create-baseline-grid-dialog.component';
import { SchedulingMainSplitActivityByLocationsDialogComponent } from './components/scheduling-main-split-activity-by-locations-dialog.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { SchedulingMainSourceDialogComponent } from './components/scheduling-main-source-dialog.component';
import { SchedulingMainChangeStatusOfAllActivitiesDialogComponent } from './components/scheduling-main-change-status-of-all-activities-dialog.component';

const routes: Routes = [new BusinessModuleRoute(SchedulingMainModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, GridComponent],
	declarations: [
		SchedulingMainDeleteBaselineDialogComponent,
		SchedulingMainCreateBaselineGridDialogComponent,
		SchedulingMainSplitActivityByLocationsDialogComponent,
		SchedulingMainSourceDialogComponent,
		SchedulingMainChangeStatusOfAllActivitiesDialogComponent],
	providers: [],
})
export class SchedulingMainModule {}
