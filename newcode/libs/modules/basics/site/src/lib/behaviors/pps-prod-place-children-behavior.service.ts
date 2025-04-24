/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsProdPlaceChildrenDataService } from '../services/pps-prod-place-children-data.service';
import { PpsProdPlaceChildrenEntity } from '../model/pps-prod-place-children-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const PPS_PROD_PLACE_CHILDREN_BEHAVIOR_TOKEN = new InjectionToken<PpsProdPlaceChildrenBehavior>('ppsProdPlaceChildrenBehavior');

@Injectable({
	providedIn: 'root',
})
export class PpsProdPlaceChildrenBehavior implements IEntityContainerBehavior<IGridContainerLink<PpsProdPlaceChildrenEntity>, PpsProdPlaceChildrenEntity> {
	private dataService: PpsProdPlaceChildrenDataService;
	
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
		this.dataService = inject(PpsProdPlaceChildrenDataService);
	}

	public onCreate(containerLink: IGridContainerLink<PpsProdPlaceChildrenEntity>): void {
	}

	
}
