/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { ISchedulingCalendarWorkHourEntity } from '@libs/scheduling/interfaces';
import { SchedulingCalendarWorkHourDataService } from '../services/scheduling-calendar-work-hour-data.service';

export const SCHEDULING_CALENDAR_WORK_HOUR_BEHAVIOR_TOKEN = new InjectionToken<SchedulingCalendarWorkHourBehavior>('SchedulingCalendarWorkHourBehavior');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarWorkHourBehavior implements IEntityContainerBehavior<IGridContainerLink<ISchedulingCalendarWorkHourEntity>, ISchedulingCalendarWorkHourEntity> {
	private dataService: SchedulingCalendarWorkHourDataService;

	private parentDataService: SchedulingCalendarDataService;

	public constructor() {
		this.dataService = inject(SchedulingCalendarWorkHourDataService);
		this.parentDataService = inject(SchedulingCalendarDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ISchedulingCalendarWorkHourEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
			const parData = this.parentDataService.getSelection();
			const gridColumn = containerLink.gridConfig.columns;
			if (parData[0].WorkHourDefinesWorkDay === true && gridColumn !== undefined) {
				gridColumn.forEach(item => {
					item.readonly = false;
				});
			} else if (gridColumn !== undefined) {
				gridColumn.forEach(item => {
					item.readonly = true;
				});
			}
		});

		containerLink.registerSubscription(dataSub);

	}

}
