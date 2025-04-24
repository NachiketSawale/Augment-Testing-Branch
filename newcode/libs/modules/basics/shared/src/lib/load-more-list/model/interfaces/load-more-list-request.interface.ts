/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing a request to load more items in a list.
 */
export interface ILoadMoreListRequest {
	/**
	 * The number of the page to load.
	 */
	pageNumber: number;

	/**
	 * The number of items per page.
	 */
	pageSize: number;

	/**
	 * The user input for filtering or searching items.
	 */
	userInput: string;
}
