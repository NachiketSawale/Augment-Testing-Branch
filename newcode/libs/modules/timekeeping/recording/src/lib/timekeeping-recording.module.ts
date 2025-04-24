/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { TimekeepingRecordingModuleInfo } from './model/timekeeping-recording-module-info.class';
import { TIMEKEEPING_RECORDING_DATA_TOKEN, TimekeepingRecordingDataService } from './services/timekeeping-recording-data.service';
import { timekeepingBreakDataFactory } from './services/timekeeping-break-data.factory';
import { BREAK_DATA } from './services/timekeeping-recording-break-data.service';

const routes: Routes = [new BusinessModuleRoute(TimekeepingRecordingModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{provide: TIMEKEEPING_RECORDING_DATA_TOKEN, useExisting: TimekeepingRecordingDataService},
		{provide: BREAK_DATA, useFactory: timekeepingBreakDataFactory}
	]
	,
})
export class TimekeepingRecordingModule {
}
