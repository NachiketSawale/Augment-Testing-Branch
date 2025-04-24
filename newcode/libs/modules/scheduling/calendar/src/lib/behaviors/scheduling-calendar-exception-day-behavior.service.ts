/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { SchedulingCalendarExceptionDayDataService } from '../services/scheduling-calendar-exception-day-data.service';
import { ISearchPayload } from '@libs/platform/common';
import { ISchedulingCalendarExceptionDayEntity } from '@libs/scheduling/interfaces';
export const SCHEDULING_CALENDAR_EXCEPTION_DAY_BEHAVIOR_TOKEN = new InjectionToken<ISchedulingCalendarExceptionDayBehavior>('schedulingCalendarExceptionDayBehavior');

@Injectable({
	providedIn: 'root',
})
export class ISchedulingCalendarExceptionDayBehavior implements IEntityContainerBehavior<IGridContainerLink<ISchedulingCalendarExceptionDayEntity>, ISchedulingCalendarExceptionDayEntity> {
	private dataService: SchedulingCalendarExceptionDayDataService;


	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true,
	};

	public constructor() {
		this.dataService = inject(SchedulingCalendarExceptionDayDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ISchedulingCalendarExceptionDayEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

	}

}
