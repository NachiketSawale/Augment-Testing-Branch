/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProductionplanningStrandpattern2materialDataService } from '../services/productionplanning-strandpattern2material-data.service';
import { ProductionplanningStrandpattern2materialEntity } from '../model/productionplanning-strandpattern2material-entity.class';
import { ISearchPayload } from '@libs/platform/common';
export const PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_BEHAVIOR_TOKEN = new InjectionToken<ProductionplanningStrandpattern2materialBehavior>('productionplanningStrandpattern2materialBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningStrandpattern2materialBehavior implements IEntityContainerBehavior<IGridContainerLink<ProductionplanningStrandpattern2materialEntity>, ProductionplanningStrandpattern2materialEntity> {
	private dataService: ProductionplanningStrandpattern2materialDataService;
	

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
		this.dataService = inject(ProductionplanningStrandpattern2materialDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ProductionplanningStrandpattern2materialEntity>): void {
		
	}

}
