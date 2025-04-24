/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { SchedulingCalendarWeekDayDataService } from '../services/scheduling-calendar-week-day-data.service';
import { ISchedulingCalendarWeekDayEntity } from '@libs/scheduling/interfaces';
export const SCHEDULING_CALENDAR_WEEK_DAY_BEHAVIOR_TOKEN = new InjectionToken<SchedulingCalendarWeekDayBehavior>('schedulingCalendarWeekDayBehavior');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarWeekDayBehavior implements IEntityContainerBehavior<IGridContainerLink<ISchedulingCalendarWeekDayEntity>, ISchedulingCalendarWeekDayEntity> {
	private dataService: SchedulingCalendarWeekDayDataService;


	public constructor() {
		this.dataService = inject(SchedulingCalendarWeekDayDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ISchedulingCalendarWeekDayEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}

}
