/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {Observable} from 'rxjs';

import { IEntityContext, IIdentificationData } from '@libs/platform/common';

import {ILookupConfig} from './lookup-options.interface';
import {ILookupSearchRequest} from './lookup-search-request.interface';
import {ILookupSearchResponse} from './lookup-search-response.interface';
import {ILookupDataCache} from './lookup-data-cache.interface';
import {ILookupDataPage} from './lookup-data-page.interface';
import {ILookupDataSync} from './lookup-data-sync.interface';
import {ILookupDataTree} from './lookup-data-tree.interface';

/**
 * Lookup data service interface
 */
export interface ILookupReadonlyDataService<TItem extends object, TEntity extends object> {
	/**
	 * lookup config
	 */
	config: ILookupConfig<TItem, TEntity>;
	/**
	 * lookup data cache
	 */
	cache: ILookupDataCache<TItem>;
	/**
	 * lookup data paging
	 */
	paging: ILookupDataPage<TItem>;
	/**
	 * Synchronize data extension which holds synchronize data operations
	 */
	syncService?: ILookupDataSync<TItem>;
	/**
	 * Tree data extension which deals with tree data
	 */
	tree?: ILookupDataTree<TItem>;

	/**
	 * Lookup data item identifier
	 * @param item
	 */
	identify(item: TItem): IIdentificationData;

	/**
	 * Get whole lookup entities
	 * @param context
	 */
	getList(context?: IEntityContext<TEntity>): Observable<TItem[]>;

	/**
	 * Search lookup entities
	 * @param request
	 * @param context
	 */
	getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<TItem>>;

	/**
	 * Get lookup entity by id
	 * @param key
	 * @param context
	 */
	getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<TItem>;

	/**
	 * Get default lookup entity asynchronously
	 * @param context
	 */
	getDefaultAsync(context?: IEntityContext<TEntity>): Promise<TItem | null | undefined>;

	/**
	 * Get whole lookup entities asynchronously
	 * @param context
	 */
	getListAsync(context?: IEntityContext<TEntity>): Promise<TItem[]>;

	/**
	 * Get lookup entity by id asynchronously
	 * @param key
	 * @param context
	 */
	getItemByKeyAsync(key: IIdentificationData, context?: IEntityContext<TEntity>): Promise<TItem>;

	/**
	 * Search lookup entities asynchronously
	 * @param request
	 * @param context
	 */
	getSearchListAsync(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Promise<ILookupSearchResponse<TItem>>;
}