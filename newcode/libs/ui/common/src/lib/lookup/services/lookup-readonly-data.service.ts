/*
 * Copyright(c) RIB Software GmbH
 */

import { get, isBoolean, isUndefined, sortBy } from 'lodash';
import { Observable, Subscriber, firstValueFrom, from } from 'rxjs';

import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IEntityContext, IIdentificationData, PlatformConfigurationService } from '@libs/platform/common';
import { ILookupReadonlyDataService } from '../model/interfaces/lookup-readonly-data-service.interface';
import { ILookupConfig } from '../model/interfaces/lookup-options.interface';
import { ILookupSearchRequest } from '../model/interfaces/lookup-search-request.interface';
import { ILookupSearchResponse } from '../model/interfaces/lookup-search-response.interface';
import { LookupDataCache } from '../model/lookup-data-cache';
import { LookupDataPage } from '../model/lookup-data-page';
import { LookupDataTree } from '../model/lookup-data-tree';
import { ILookupDataSync } from '../model/interfaces/lookup-data-sync.interface';
import { ILookupDataTree } from '../model/interfaces/lookup-data-tree.interface';
import { LookupIdentificationData } from '../model/lookup-identification-data';
import { LookupHttpCacheService } from './lookup-http-cache.service';
import { LookupUrlParams } from '../model/interfaces/lookup-http-cache.model';

/**
 * @description: abstract lookup data service to handler stuff such as, load data, get data list, get default item,
 * get item by key value and get search list.
 */
export abstract class UiCommonLookupReadonlyDataService<TItem extends object, TEntity extends object = object> implements ILookupReadonlyDataService<TItem, TEntity> {
	/**
	 * cache object
	 */
	public cache = new LookupDataCache<TItem>(this.identify);
	/**
	 * paging object
	 */
	public paging = new LookupDataPage<TItem>();
	/**
	 * handle fast input in grid
	 */
	public syncService?: ILookupDataSync<TItem>;
	/**
	 * Handle tree data in grid
	 */
	public tree?: ILookupDataTree<TItem>;
	/**
	 * array, api interface [{processItem: function(item){}]
	 * @private
	 */
	public dataProcessors: { processItem: (dataItem: TItem) => void }[] = [];

	/**
	 * default member to check if item is default, could be override in child class
	 * @protected
	 * @type {string}
	 */
	protected isDefaultMember = 'IsDefault';
	/**
	 * default member to sort item, could be override in child class
	 * @protected
	 * @type {string}
	 */
	protected defaultSortingMember: string = 'Sorting';
	/**
	 * @deprecated will be removed, use httpCacheService instead
	 * @protected
	 */
	protected readonly http = inject(HttpClient);
	/**
	 * @deprecated will be removed, use httpCacheService instead
	 * @protected
	 */
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly httpCacheService = inject(LookupHttpCacheService);

	protected constructor(public config: ILookupConfig<TItem, TEntity>) {
		if (isUndefined(this.config.showGrid)) {
			this.config.showGrid = !!this.config.gridConfig;
		}
		if (isUndefined(this.config.showDialog)) {
			this.config.showDialog = !!this.config.dialogComponent || !!this.config.dialogOptions;
		}
		if (isUndefined(this.config.canListAll)) {
			this.config.canListAll = !this.config.showDialog;
		}
		if (isBoolean(config.disableDataCaching)) {
			this.cache.enabled = !config.disableDataCaching;
		} else {
			this.cache.enabled = !this.config.showDialog;
		}
		this.cache.enableSearchCache = !this.config.showDialog;
		if (this.config.treeConfig) {
			this.tree = new LookupDataTree<TItem>(this.identify);
		}
	}

	/**
	 * Processes the provided list of items using the registered data processors.
	 *
	 * @param {TItem[]} items - The list of items to be processed.
	 */
	protected processItems(items: TItem[]) {
		if (!items) {
			return;
		}

		this.dataProcessors.forEach((processor) => {
			items.forEach((item) => {
				processor.processItem(item);
			});
		});
	}

	/**
	 * Handles the provided list of items by converting, filtering, processing, and sorting them.
	 *
	 * @param {TItem[]} list - The list of items to be handled.
	 * @returns {TItem[]} - The handled list of items.
	 */
	protected handleList(list: TItem[]): TItem[] {
		list = this.convertList(list);
		list = this.filterList(list);
		this.processItems(list);
		return this.sortList(list);
	}

	/**
	 * Converts the provided list of items. This method can be overridden to provide custom conversion logic.
	 *
	 * @param {TItem[]} list - The list of items to be converted.
	 * @returns {TItem[]} - The converted list of items.
	 */
	protected convertList(list: TItem[]): TItem[] {
		return list;
	}

	/**
	 * Filters the provided list of items based on their 'live' status and sorting value.
	 *
	 * @param {TItem[]} list - The list of items to be filtered.
	 * @returns {TItem[]} - The filtered list of items.
	 */
	protected filterList(list: TItem[]): TItem[] {
		return list.filter((item) => {
			return this.isItemLive(item) !== false; // Check if the item is live or the property is not set.
		});
	}

	/**
	 * Checks if the item is live.
	 *
	 * @param {TItem} item - The item to check.
	 * @returns {boolean | undefined | null} - Returns true if the item is live, false otherwise, or undefined/null if the property is not set.
	 */
	protected isItemLive(item: TItem): boolean | undefined | null {
		return get(item, 'IsLive') as boolean;
	}

	/**
	 * Retrieves the sorting value of the item.
	 *
	 * @param {TItem} item - The item to get the sorting value from.
	 * @returns {number | undefined | null} - The sorting value of the item, or undefined/null if the property is not set.
	 */
	protected getItemSorting(item: TItem): number | undefined | null {
		return get(item, this.defaultSortingMember) as number;
	}

	/**
	 * Sorts the list of items based on specified properties.
	 *
	 * @param {TItem[]} list - The list of items to be sorted.
	 * @returns {TItem[]} - The sorted list of items.
	 */
	protected sortList(list: TItem[]): TItem[] {
		const propertiesToSort = this.getPropertiesToSort();

		if (propertiesToSort && propertiesToSort.length > 0) {
			list = sortBy(list, propertiesToSort);
		}

		return list;
	}

	/**
	 * Retrieves the properties to sort the items by.
	 *
	 * @returns {(keyof TItem | string)[]} - An array of properties to sort by.
	 */
	protected getPropertiesToSort(): (keyof TItem | string)[] {
		return [this.defaultSortingMember];
	}

	/**
	 * Get data from url with cache
	 * @param url
	 * @param params
	 * @protected
	 */
	protected get(url: string, params?: LookupUrlParams): Observable<unknown> {
		return from(
			this.httpCacheService.getWithCache(url, {
				params,
			}),
		);
	}

	/**
	 * Post data to url with cache
	 * @param url
	 * @param body
	 * @protected
	 */
	protected post(url: string, body?: unknown): Observable<unknown> {
		return from(
			this.httpCacheService.postWithCache(url, {
				body,
			}),
		);
	}

	/**
	 * @deprecated it is useless, will be removed later
	 * @protected
	 */
	protected makeHttpOptions() {
		return {};
	}

	/**
	 * map data item to entity
	 * @param item
	 */
	public mapEntity(item: unknown): TItem {
		return item as TItem;
	}

	/**
	 * Returns identification data of entity
	 * @param item
	 */
	public identify(item: TItem): IIdentificationData {
		let id: unknown = get(item, 'Id');

		if (id == null) {
			id = get(item, 'id');
		}
		if (id == null && this.config.idProperty) {
			id = get(item, this.config.idProperty);
		}

		return new LookupIdentificationData(id as number | string);
	}

	/**
	 * Complete subscriber with value
	 * @param subscriber
	 * @param value
	 * @protected
	 */
	protected completeWithValue<TValue>(subscriber: Subscriber<TValue>, value: TValue) {
		subscriber.next(value);
		subscriber.complete();
	}

	/**
	 * Get all lookup entities
	 */
	public abstract getList(context?: IEntityContext<TEntity>): Observable<TItem[]>;

	/**
	 * Search lookup entities
	 * @param request
	 */
	public abstract getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<TItem>>;

	/**
	 * Get lookup entity by identification data
	 * @param key
	 */
	public abstract getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<TItem>;

	/**
	 * Get default lookup entity asynchronously
	 * The default mechanism is to getList first then find the first item with IsDefault property is true in frontend,
	 * but if current lookup has a big number of data, it is better to override this method to get default item from backend.
	 * @param context
	 */
	public async getDefaultAsync(context?: IEntityContext<TEntity>): Promise<TItem | null | undefined> {
		const list = await firstValueFrom(this.getList(context));

		if (!list?.length) {
			return null;
		}

		let defaultItem = list.find((item) => get(item, this.isDefaultMember) === true);

		if (!defaultItem) {
			defaultItem = list[0];
		}

		return defaultItem;
	}

	/**
	 * Get whole lookup entities asynchronously, async/await version of getList
	 * @param context
	 */
	public async getListAsync(context?: IEntityContext<TEntity>): Promise<TItem[]> {
		return firstValueFrom(this.getList(context));
	}

	/**
	 * Get lookup entity by id asynchronously, async/await version of getItemByKey
	 * @param key
	 * @param context
	 */
	public async getItemByKeyAsync(key: IIdentificationData, context?: IEntityContext<TEntity>): Promise<TItem> {
		return firstValueFrom(this.getItemByKey(key, context));
	}

	/**
	 * Search lookup entities asynchronously, async/await version of getSearchList
	 * @param request
	 * @param context
	 */
	public async getSearchListAsync(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Promise<ILookupSearchResponse<TItem>> {
		return firstValueFrom(this.getSearchList(request, context));
	}
}
