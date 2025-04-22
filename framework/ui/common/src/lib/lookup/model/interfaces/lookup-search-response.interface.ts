/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Search response interface
 */
export interface ILookupSearchResponse<TEntity> {
	/**
	 * items count found
	 */
	itemsFound: number;
	/**
	 * items count retrieved
	 */
	itemsRetrieved: number;
	/**
	 * data items returned
	 */
	items: TEntity[]
}

/**
 * Http response of searching
 */
export interface ILookupSearchHttpResponse {
	/**
	 * Lookup entities which satisfy the search criteria
	 */
	SearchList?: unknown[];
	/**
	 * Total count found
	 */
	RecordsFound: number;
	/**
	 * Count retrieved
	 */
	RecordsRetrieved: number;
}