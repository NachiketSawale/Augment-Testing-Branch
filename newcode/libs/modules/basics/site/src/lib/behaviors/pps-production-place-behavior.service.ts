/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsProductionPlaceDataService } from '../services/pps-production-place-data.service';
import { PpsProductionPlaceEntity } from '../model/pps-production-place-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const PPS_PRODUCTION_PLACE_BEHAVIOR_TOKEN = new InjectionToken<PpsProductionPlaceBehavior>('ppsProductionPlaceBehavior');

@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceBehavior implements IEntityContainerBehavior<IGridContainerLink<PpsProductionPlaceEntity>, PpsProductionPlaceEntity> {
	private dataService: PpsProductionPlaceDataService;
	
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
		this.dataService = inject(PpsProductionPlaceDataService);
	}

	public onCreate(containerLink: IGridContainerLink<PpsProductionPlaceEntity>): void {
	}

}
