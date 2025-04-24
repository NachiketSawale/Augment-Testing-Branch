/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsSite2TksShiftDataService } from '../services/basics-site2-tks-shift-data.service';
import { BasicsSite2TksShiftEntity } from '../model/basics-site2-tks-shift-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const BASICS_SITE2_TKS_SHIFT_BEHAVIOR_TOKEN = new InjectionToken<BasicsSite2TksShiftBehavior>('basicsSite2TksShiftBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2TksShiftBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsSite2TksShiftEntity>, BasicsSite2TksShiftEntity> {
	private dataService: BasicsSite2TksShiftDataService;
	
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
		this.dataService = inject(BasicsSite2TksShiftDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsSite2TksShiftEntity>): void {
	}

}
