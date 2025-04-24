/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsCostGroupCatalogDataService } from '../services/basics-cost-group-catalog-data.service';
import { BasicsCostGroupCatalogEntity } from '../model/entities/basics-cost-group-catalog-entity.class';
import { ISearchPayload } from '@libs/platform/common';
@Injectable({
	providedIn: 'root',
})
export class BasicsCostGroupCatalogBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsCostGroupCatalogEntity>, BasicsCostGroupCatalogEntity> {
	private dataService: BasicsCostGroupCatalogDataService;
	
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
		this.dataService = inject(BasicsCostGroupCatalogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsCostGroupCatalogEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);

		this.dataService.refresh(this.searchPayload).then((data) => (containerLink.gridData = data.dtos));
	}

}
