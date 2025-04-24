/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { SchedulingCalendarWorkDayDataService } from '../services/scheduling-calendar-workday-data.service';
import { ISchedulingCalendarWorkDayEntity } from '@libs/scheduling/interfaces';
import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';

export const SCHEDULING_CALENDAR_WORK_DAY_BEHAVIOR_TOKEN = new InjectionToken<SchedulingCalendarWorkDayBehavior>('schedulingCalendarWorkDayBehavior');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarWorkDayBehavior implements IEntityContainerBehavior<IGridContainerLink<ISchedulingCalendarWorkDayEntity>, ISchedulingCalendarWorkDayEntity> {
	private dataService: SchedulingCalendarWorkDayDataService;

	private parentDataService:SchedulingCalendarDataService;

	public constructor() {
		this.dataService = inject(SchedulingCalendarWorkDayDataService);
		this.parentDataService = inject(SchedulingCalendarDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ISchedulingCalendarWorkDayEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
			const parData = this.parentDataService.getSelection();
			const gridColumn = containerLink.gridConfig.columns;
			if(parData[0].WorkHourDefinesWorkDay===false && gridColumn !==undefined){

				gridColumn.forEach(item => {
					item.readonly=false;
				});
				} else if(gridColumn !==undefined){
				gridColumn.forEach(item => {
					item.readonly=true;
				});
			}
		});

		containerLink.registerSubscription(dataSub);

	}

}
