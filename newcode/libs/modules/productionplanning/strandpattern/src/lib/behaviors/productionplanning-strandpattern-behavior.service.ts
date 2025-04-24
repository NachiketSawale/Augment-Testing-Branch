/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProductionplanningStrandpatternDataService } from '../services/productionplanning-strandpattern-data.service';
import { ProductionplanningStrandpatternEntity } from '../model/productionplanning-strandpattern-entity.class';
import { ISearchPayload } from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
export const PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN = new InjectionToken<ProductionplanningStrandpatternBehavior>('productionplanningStrandpatternBehavior');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningStrandpatternBehavior implements IEntityContainerBehavior<IGridContainerLink<ProductionplanningStrandpatternEntity>, ProductionplanningStrandpatternEntity> {
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

		containerLink.uiAddOns.toolbar.addItems([
			{
			caption: { text: 'Pin Selected Item' },
			hideItem: false,
			iconClass: 'tlb-icons ico-set-prj-context',
			id: 't-pinningctx',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 120,
			type: ItemType.Item,
			},
			{
			caption: { key: 'cloud.common.bulkEditor.title' },
			hideItem: false,
			iconClass: 'type-icons ico-construction51',
			id: 't14',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 140,
			type: ItemType.Item,
			},
		]);
	}

}
