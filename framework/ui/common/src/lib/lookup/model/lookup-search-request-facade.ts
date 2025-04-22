/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {LookupSearchRequest} from './lookup-search-request';

export class LookupSearchRequestFacade extends LookupSearchRequest {
	public matchExact = false;
	public matchFront = false;

	public constructor(searchText: string, searchFields: string[]) {
		super(searchText, searchFields);
	}
}