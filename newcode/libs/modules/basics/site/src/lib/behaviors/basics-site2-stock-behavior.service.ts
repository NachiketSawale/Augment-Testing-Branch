/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsSite2StockDataService } from '../services/basics-site2-stock-data.service';
import { BasicsSite2StockEntity } from '../model/basics-site2-stock-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const BASICS_SITE2_STOCK_BEHAVIOR_TOKEN = new InjectionToken<BasicsSite2StockBehavior>('basicsSite2StockBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsSite2StockBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsSite2StockEntity>, BasicsSite2StockEntity> {
	private dataService: BasicsSite2StockDataService;
	
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
		this.dataService = inject(BasicsSite2StockDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsSite2StockEntity>): void {
	}

}
