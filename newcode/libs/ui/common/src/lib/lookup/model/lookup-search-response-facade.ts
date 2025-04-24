/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {LookupSearchResponse} from './lookup-search-response';

export class LookupSearchResponseFacade<TEntity> extends LookupSearchResponse<TEntity> {
	public completeItem?: TEntity | null;

	public constructor(items: TEntity[]) {
		super(items);
	}
}