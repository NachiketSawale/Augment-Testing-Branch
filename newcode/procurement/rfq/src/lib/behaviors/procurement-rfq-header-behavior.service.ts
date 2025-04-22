/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ISearchPayload, ServiceLocator } from '@libs/platform/common';
import { PrcContractTypeLookupService, PrcRfqStatusLookupService } from '@libs/procurement/shared';

/**
 * Rfq header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqHeaderEntity>, IRfqHeaderEntity> {
	private readonly dataService: ProcurementRfqHeaderMainDataService;

	private readonly searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,
		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: false
	};

	public constructor() {
		this.dataService = inject(ProcurementRfqHeaderMainDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IRfqHeaderEntity>) {

	}

	public onInit(containerLink: IGridContainerLink<IRfqHeaderEntity>) {
		ServiceLocator.injector.get(PrcRfqStatusLookupService).getList();
		ServiceLocator.injector.get(PrcContractTypeLookupService).getList();
	}
}