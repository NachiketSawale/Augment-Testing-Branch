/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { ILoadMoreListResponse } from './load-more-list-response.interface';
import { ILoadMoreListRequest } from './load-more-list-request.interface';

/**
 * Interface representing a provider for loading more items in a list.
 *
 * @template T - The type of items to be loaded.
 */
export interface ILoadMoreListProvider<T> {
	/**
	 * The number of items to be loaded per page.
	 * @type {number}
	 */
	pageSize?: number;

	/**
	 * Fetches more items based on the provided request.
	 *
	 * @param {ILoadMoreListRequest} request - The request containing pagination and filtering information.
	 * @returns {Promise<ILoadMoreListResponse<T>>} A promise that resolves to a response containing the loaded items and a flag indicating if there are more items to load.
	 */
	fetch(request: ILoadMoreListRequest): Promise<ILoadMoreListResponse<T>>;

	/**
	 * Selects an item from the list.
	 *
	 * @param {T} item - The item to be selected.
	 */
	select(item: T): void;

	/**
	 * Formats an item into a string representation.
	 *
	 * @param {T} item - The item to be formatted.
	 * @returns {string} The string representation of the item.
	 */
	format(item: T): string;
}

export const LOAD_MORE_LIST_PROVIDER = new InjectionToken<ILoadMoreListProvider<unknown>>('LOAD_MORE_LIST_PROVIDER');
