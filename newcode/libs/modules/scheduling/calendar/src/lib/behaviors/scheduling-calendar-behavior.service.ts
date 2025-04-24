/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { ISchedulingCalendarEntity } from '@libs/scheduling/interfaces';
import { ISearchPayload } from '@libs/platform/common';
export const SCHEDULING_CALENDAR_BEHAVIOR_TOKEN = new InjectionToken<SchedulingCalendarBehavior>('schedulingCalendarBehavior');

@Injectable({
	providedIn: 'root',
})
export class SchedulingCalendarBehavior implements IEntityContainerBehavior<IGridContainerLink<ISchedulingCalendarEntity>, ISchedulingCalendarEntity> {
	private readonly dataService= inject(SchedulingCalendarDataService);


	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: 'de',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true,
	};

	public onCreate(containerLink: IGridContainerLink<ISchedulingCalendarEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

		this.dataService.refresh(this.searchPayload).then((data) => (containerLink.gridData = data.dtos));


	}

}
