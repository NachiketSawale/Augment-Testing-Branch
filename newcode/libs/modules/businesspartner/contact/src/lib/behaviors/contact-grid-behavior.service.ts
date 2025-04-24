/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ISearchPayload} from '@libs/platform/common';
import {IContactEntity} from '@libs/businesspartner/interfaces';
import {ContactDataService} from '../services/contact-data.service';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ContactGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IContactEntity>, IContactEntity> {
	private dataService: ContactDataService;

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
		useCurrentClient: false
	};

	public constructor() {
		this.dataService = inject(ContactDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IContactEntity>) {
		this.dataService.filter(this.searchPayload).then(data => containerLink.gridData = data.dtos); // TODO chi: data.dtos is not available in Bp, but Main
	}
}