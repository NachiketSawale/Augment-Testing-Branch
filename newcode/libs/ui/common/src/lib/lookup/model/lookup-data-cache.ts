/*
 * Copyright(c) RIB Software GmbH
 */

import {IIdentificationData} from '@libs/platform/common';
import {ILookupDataCache} from './interfaces/lookup-data-cache.interface';
import {ILookupSearchResponse} from './interfaces/lookup-search-response.interface';
import { LookupIdentificationData } from './lookup-identification-data';

/**
 * Handle lookup entity cache
 */
export class LookupDataCache<TEntity> implements ILookupDataCache<TEntity> {
	private _searchHistoryCount = 5;
	/**
	 * Is cache enabled
	 */
	public enabled = false;
	/**
	 * enable caching for search list
	 */
	public enableSearchCache = false;
	/**
	 * Is data loaded
	 */
	public loaded = false;
	/**
	 * whole lookup entities
	 */
	public list: TEntity[] = [];
	/**
	 * part of lookup entities, such as format items
	 */
	public keyItemMap = new Map<string, TEntity>;
	/**
	 * cache for search list depend on different search condition
	 */
	public searchListMap = new Map<string, ILookupSearchResponse<TEntity>>();

	/**
	 * default constructor
	 * @param identifier
	 */
	public constructor(public identifier: (e: TEntity) => IIdentificationData) {

	}

	/**
	 * clear cache
	 */
	public clear() {
		this.list = [];
		this.keyItemMap.clear();
		this.searchListMap.clear();
		this.loaded = false;
	}

	/**
	 * cache whole data list
	 * @param list
	 */
	public setList(list: TEntity[]) {
		this.list = list;
		this.loaded = true;
	}

	/**
	 * get whole data list
	 */
	public getList(): TEntity[] {
		return this.list;
	}

	/**
	 * get item
	 * @param id
	 */
	public getItem(id: number | string | IIdentificationData) {
		const data = LookupIdentificationData.convert(id);

		const key = LookupIdentificationData.stringify(data);

		if (this.keyItemMap.has(key)) {
			return this.keyItemMap.get(key);
		}

		for (let i = 0; i < this.list.length; i++) {
			const item = this.list[i];

			if (LookupIdentificationData.equal(data, this.identifier(item))) {
				this.keyItemMap.set(key, item);
				return item;
			}
		}

		return null;
	}

	/**
	 * Cache item
	 * @param item
	 */
	public setItem(item: TEntity) {
		const key = LookupIdentificationData.stringify(this.identifier(item));
		this.keyItemMap.set(key, item);
	}

	/**
	 * Cache items
	 * @param items
	 */
	public setItems(items: TEntity[]) {
		items.forEach(item => {
			this.setItem(item);
		});
	}

	/**
	 * get all cache items
	 */
	public getAll() {
		if (this.loaded) {
			return this.list;
		}

		return [...this.keyItemMap.values()];
	}

	/**
	 * cache search list
	 * @param key
	 * @param list
	 */
	public setSearchList(key: string, list: ILookupSearchResponse<TEntity>) {
		if (this.searchListMap.size > this._searchHistoryCount) {
			this.searchListMap.clear();
		}

		this.searchListMap.set(key, list);
		this.setItems(list.items);
	}

	/**
	 * get search list from cache
	 * @param key
	 */
	public getSearchList(key: string) {
		return this.searchListMap.get(key);
	}
}
