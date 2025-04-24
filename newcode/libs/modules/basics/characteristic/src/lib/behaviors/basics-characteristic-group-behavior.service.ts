/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ISearchPayload } from '@libs/platform/common';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicGroupDataService } from '../services/basics-characteristic-group-data.service';

/**
 * characteristic group behavior service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<ICharacteristicGroupEntity>, ICharacteristicGroupEntity> {
	private dataService: BasicsCharacteristicGroupDataService;
	
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
		this.dataService = inject(BasicsCharacteristicGroupDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ICharacteristicGroupEntity>): void {
		this.dataService.refresh(this.searchPayload).then((data) => (containerLink.gridData = data.dtos));
	}

}
