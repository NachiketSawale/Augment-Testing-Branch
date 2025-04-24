/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsCommonCalendarSiteDataService } from '../services/pps-common-calendar-site-data.service';
import { PpsCommonCalendarSiteEntity } from '../model/pps-common-calendar-site-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const PPS_COMMON_CALENDAR_SITE_BEHAVIOR_TOKEN = new InjectionToken<PpsCommonCalendarSiteBehavior>('ppsCommonCalendarSiteBehavior');

@Injectable({
	providedIn: 'root',
})
export class PpsCommonCalendarSiteBehavior implements IEntityContainerBehavior<IGridContainerLink<PpsCommonCalendarSiteEntity>, PpsCommonCalendarSiteEntity> {
	private dataService: PpsCommonCalendarSiteDataService;
	
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
		this.dataService = inject(PpsCommonCalendarSiteDataService);
	}

	public onCreate(containerLink: IGridContainerLink<PpsCommonCalendarSiteEntity>): void {
	}

}
