/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsSite2ExternalDataService } from '../services/basics-site2-external-data.service';
import { BasicsSite2ExternalEntity } from '../model/basics-site2-external-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const BASICS_SITE2_EXTERNAL_BEHAVIOR_TOKEN = new InjectionToken<BasicsSite2ExternalBehavior>('basicsSite2ExternalBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2ExternalBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsSite2ExternalEntity>, BasicsSite2ExternalEntity> {
	private dataService: BasicsSite2ExternalDataService;
	
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
		this.dataService = inject(BasicsSite2ExternalDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsSite2ExternalEntity>): void {
	}

	
}
