/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { SchedulingCalendarModuleInfo } from './model/scheduling-calendar-module-info.class';
import { SCHEDULING_CALENDAR_DATA_TOKEN, SchedulingCalendarDataService } from './services/scheduling-calendar-data.service';
import { SCHEDULING_CALENDAR_BEHAVIOR_TOKEN, SchedulingCalendarBehavior } from './behaviors/scheduling-calendar-behavior.service';
import { SCHEDULING_CALENDAR_EXCEPTION_DAY_DATA_TOKEN, SchedulingCalendarExceptionDayDataService } from './services/scheduling-calendar-exception-day-data.service';
import { ISchedulingCalendarExceptionDayBehavior, SCHEDULING_CALENDAR_EXCEPTION_DAY_BEHAVIOR_TOKEN } from './behaviors/scheduling-calendar-exception-day-behavior.service';
import { SCHEDULING_CALENDAR_WORK_DAY_DATA_TOKEN, SchedulingCalendarWorkDayDataService } from './services/scheduling-calendar-workday-data.service';
import { SCHEDULING_CALENDAR_WORK_DAY_BEHAVIOR_TOKEN, SchedulingCalendarWorkDayBehavior } from './behaviors/scheduling-calendar-workday-behavior.service';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { SCHEDULING_CALENDAR_WEEK_DAY_BEHAVIOR_TOKEN,SchedulingCalendarWeekDayBehavior } from './behaviors/scheduling-calendar-week-day-behavior.service';
import { SCHEDULING_CALENDAR_WORK_HOUR_BEHAVIOR_TOKEN, SchedulingCalendarWorkHourBehavior } from './behaviors/scheduling-calendar-work-hour-behavior.service';
import { UiContainerSystemMainViewService } from '@libs/ui/container-system';
const routes: Routes = [new BusinessModuleRoute(SchedulingCalendarModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers : [
		{ provide: SCHEDULING_CALENDAR_BEHAVIOR_TOKEN, useExisting: SchedulingCalendarBehavior },
		{ provide: SCHEDULING_CALENDAR_DATA_TOKEN, useExisting: SchedulingCalendarDataService },
		{provide: SCHEDULING_CALENDAR_EXCEPTION_DAY_BEHAVIOR_TOKEN, useExisting: ISchedulingCalendarExceptionDayBehavior},
		{provide: SCHEDULING_CALENDAR_EXCEPTION_DAY_DATA_TOKEN, useExisting: SchedulingCalendarExceptionDayDataService},
		{provide: SCHEDULING_CALENDAR_WEEK_DAY_BEHAVIOR_TOKEN, useExisting: SchedulingCalendarWeekDayBehavior},
		{provide: SCHEDULING_CALENDAR_EXCEPTION_DAY_DATA_TOKEN, useExisting: SchedulingCalendarExceptionDayDataService},
		{provide: SCHEDULING_CALENDAR_WORK_DAY_DATA_TOKEN, useExisting: SchedulingCalendarWorkDayDataService},
		{provide: SCHEDULING_CALENDAR_WORK_DAY_BEHAVIOR_TOKEN, useExisting: SchedulingCalendarWorkDayBehavior},
		{provide: SCHEDULING_CALENDAR_WORK_HOUR_BEHAVIOR_TOKEN, useExisting: SchedulingCalendarWorkHourBehavior},
		{ provide: 'SCHEDULE_CALENDAR_PARENT_SERVICE', useExisting: SchedulingCalendarDataService }
	],
})
export class SchedulingCalendarModule {
	/**
	 * Initializes the timekeeping payment group module and sets the ui with the required layout.
	 * @param uiService
	 */
	public constructor(uiService: UiContainerSystemMainViewService) {

	}
}
