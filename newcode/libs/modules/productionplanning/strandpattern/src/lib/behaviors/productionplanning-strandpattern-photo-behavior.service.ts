/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ISearchPayload } from '@libs/platform/common';
import { ProductionplanningStrandpatternBehavior } from './productionplanning-strandpattern-behavior.service';
import { ProductionplanningStrandpatternEntity } from '../model/productionplanning-strandpattern-entity.class';
import { ProductionplanningStrandpatternDataService } from '../services/productionplanning-strandpattern-data.service';
export const PRODUCTIONPLANNING_STRANDPATTERN_PHOTO_BEHAVIOR_TOKEN = new InjectionToken<ProductionplanningStrandpatternPhotoBehavior>('productionplanningStrandpatternPhotoBehavior');
export const PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN = new InjectionToken<ProductionplanningStrandpatternBehavior>('productionplanningStrandpatternBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningStrandpatternPhotoBehavior implements IEntityContainerBehavior<IGridContainerLink<ProductionplanningStrandpatternEntity>, ProductionplanningStrandpatternEntity> {
	private dataService: ProductionplanningStrandpatternDataService;
	

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
		this.dataService = inject(ProductionplanningStrandpatternDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ProductionplanningStrandpatternEntity>): void {
		
	}

}
