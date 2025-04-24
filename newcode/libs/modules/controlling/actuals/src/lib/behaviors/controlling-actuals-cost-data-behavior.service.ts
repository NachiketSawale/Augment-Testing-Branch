/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ControllingActualsCostDataDataService } from '../services/controlling-actuals-cost-data-data.service';
import { ISearchPayload } from '@libs/platform/common';
import {ICompanyCostDataEntity} from '../model/entities/company-cost-data-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ControllingActualsCostDataBehavior implements IEntityContainerBehavior<IGridContainerLink<ICompanyCostDataEntity>, ICompanyCostDataEntity> {

	private dataService: ControllingActualsCostDataDataService;
	
	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: 1008350,
		useCurrentClient: true
	};

	public constructor() {
		this.dataService = inject(ControllingActualsCostDataDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICompanyCostDataEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);


	}

}