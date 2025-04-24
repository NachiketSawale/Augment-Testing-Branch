/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ISearchPayload } from '../interfaces/search-payload.interface';
import { ISearchAccess } from '../interfaces/search-access.interface';

/**
 * Implements basic functionality for search sidebar
 *
 */
@Injectable({
	providedIn: 'root',
})
export class PlatformSearchAccessService implements ISearchAccess {

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
		furtherFilters: []
	};

	/**
	 * Returns a searchPayload object.
	 *
	 * @returns {ISearchPayload}
	 */
	public currentSearchPayload(): ISearchPayload {
		return this.searchPayload;
	}



}
