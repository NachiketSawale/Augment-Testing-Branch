/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ILookupSearchResponse} from './interfaces/lookup-search-response.interface';

export class LookupSearchResponse<TEntity> implements ILookupSearchResponse<TEntity> {
	public itemsFound = 0;
	public itemsRetrieved = 0;
	public items: TEntity[] = [];

	public constructor(items: TEntity[]) {
		this.items = items;
	}
}