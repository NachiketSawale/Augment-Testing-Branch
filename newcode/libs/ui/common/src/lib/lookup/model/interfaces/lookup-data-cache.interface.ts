/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IIdentificationData} from '@libs/platform/common';

/**
 * Lookup cache interface
 */
export interface ILookupDataCache<TEntity> {
	/**
	 * enable list cache
	 */
	enabled: boolean;
	/**
	 * enable caching for search list
	 */
	enableSearchCache: boolean;
	/**
	 * is list ready
	 */
	loaded: boolean;

	/**
	 * clear cache
	 */
	clear(): void;

	/**
	 * cache whole data list
	 * @param list
	 */
	setList(list: TEntity[]): void;

	/**
	 * get whole data list from cache
	 */
	getList(): TEntity[];

	/**
	 * get item
	 * @param id
	 */
	getItem(id: IIdentificationData): TEntity | null | undefined;

	/**
	 * cache item
	 * @param item
	 */
	setItem(item: TEntity): void;

	/**
	 * cache items
	 * @param items
	 */
	setItems(items: TEntity[]): void;

	/**
	 * get all cache items
	 */
	getAll(): TEntity[];
}