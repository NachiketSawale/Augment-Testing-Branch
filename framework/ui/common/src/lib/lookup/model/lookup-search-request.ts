/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILookupSearchRequest } from './interfaces/lookup-search-request.interface';

export class LookupSearchRequest implements ILookupSearchRequest {
	public searchText: string;
	public searchFields: string[];
	public filterKey?: string;
	public filterString?: string;
	public additionalParameters?: unknown;
	public formEntity?: unknown;
	public treeState?: {
		startId?: number;
		depth?: number
	};
	public pageState?: {
		pageNumber: number;
		pageSize: number;
	};

	public constructor(searchText: string, searchFields: string[]) {
		this.searchText = searchText;
		this.searchFields = searchFields;
		this.treeState = {};
	}
}