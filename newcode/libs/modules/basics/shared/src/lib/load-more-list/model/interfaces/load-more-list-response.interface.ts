/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing the response for loading more items in a list.
 *
 * @template T - The type of items in the list.
 */
export interface ILoadMoreListResponse<T> {
	/**
	 * Indicates whether there are more items to load.
	 */
	hasMore: boolean;

	/**
	 * The loaded items.
	 */
	items: T[];
}
