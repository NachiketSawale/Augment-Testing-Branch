/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsCountryDataService } from '../services/basics-country-data.service';
import { BasicsCountryEntity } from '../model/basics-country-entity.class';
import { ISearchPayload } from '@libs/platform/common';

export const BASICS_COUNTRY_BEHAVIOR_TOKEN = new InjectionToken<BasicsCountryBehavior>('basicsCountryBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsCountryBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsCountryEntity>, BasicsCountryEntity> {
	private dataService: BasicsCountryDataService;
	
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
		this.dataService = inject(BasicsCountryDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsCountryEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

		this.dataService.refresh(this.searchPayload).then((data) => (containerLink.gridData = data.dtos));
	}

}
