/*
 * Copyright(c) RIB Software GmbH
 */

import { isObject, has } from 'lodash';
import { map, Observable } from 'rxjs';

import { IIdentificationData } from '@libs/platform/common';

import { ILookupConfig } from '../model/interfaces/lookup-options.interface';
import { ILookupSearchRequest } from '../model/interfaces/lookup-search-request.interface';
import { ILookupSearchHttpResponse, ILookupSearchResponse } from '../model/interfaces/lookup-search-response.interface';
import { LookupSearchResponse } from '../model/lookup-search-response';
import { UiCommonLookupReadonlyDataService } from './lookup-readonly-data.service';

/**
 * Standard/Preferred approach to implement lookup type
 */
export class UiCommonLookupTypeDataService<TItem extends object, TEntity extends object = object> extends UiCommonLookupReadonlyDataService<TItem, TEntity> {
	protected baseUrl = 'basics/lookupdata/masternew/';

	/**
	 * service constructor
	 * @param lookupType
	 * @param config
	 */
	public constructor(protected lookupType: string, config: ILookupConfig<TItem, TEntity>) {
		super(config);
		this.syncService = {
			getListSync: () => {
				return this.cache.getAll();
			}
		};
	}

	/**
	 * Get list
	 * @deprecated use getListAsync instead
	 */
	public getList(): Observable<TItem[]> {
		const url = this.generateUrl('getlist');
		return new Observable(subscriber => {
			if (this.cache.loaded) {
				this.completeWithValue(subscriber, this.cache.list);
			} else {
				this.get(url).subscribe(list => {
					let entities = (list as unknown[]).map(e => this.mapEntity(e));

					entities = this.handleList(entities);

					if (this.cache.enabled) {
						this.cache.setList(entities);
					}

					this.completeWithValue(subscriber, entities);
				});
			}
		});
	}

	protected copyAndAdjustSearchRequest(request: ILookupSearchRequest) {
		const copy = {...request};

		if (copy.formEntity) {
			copy.additionalParameters = {
				...<object>request.additionalParameters,
				...<object>request.formEntity
			};
			copy.formEntity = undefined;
		}

		// treeState can not be null otherwise lookup backend will throw an error
		// refer to: https://rib-40.atlassian.net/browse/DEV-34669
		if (!copy.treeState) {
			copy.treeState = {};
		}

		return copy;
	}

	/**
	 * override searching
	 * @param request
	 * @deprecated use getSearchListAsync instead
	 */
	public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<TItem>> {
		const payload = this.copyAndAdjustSearchRequest(request);
		const url = this.generateUrl('getsearchlist');
		return new Observable(subscriber => {
			const key = JSON.stringify({
				searchText: this.config.isClientSearch ? undefined : request.searchText,
				searchFields: this.config.isClientSearch ? undefined : request.searchFields,
				filterKey: request.filterKey,
				additionalParameters: request.additionalParameters,
				formEntity: request.formEntity,
				treeState: request.treeState,
				pageState: request.pageState
			});

			if (this.cache.enableSearchCache) {
				const searchList = this.cache.getSearchList(key);

				if (searchList) {
					this.completeWithValue(subscriber, searchList);
					return;
				}
			}

			this.post(url, payload).subscribe((r) => {
				this.completeWithValue(subscriber, this.generateSearchResponse(r, key));
			});
		});
	}

	/**
	 * override getting lookup entity
	 * @param key
	 * @deprecated use getItemByKeyAsync instead
	 */
	public getItemByKey(key: IIdentificationData): Observable<TItem> {
		return new Observable(subscriber => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				this.completeWithValue(subscriber, cacheItem);
			} else {
				const url = this.generateUrl('getitembykey');

				this.post(url, key).subscribe(item => {
					if (item) {
						const entity = this.mapEntity(item);
						this.processItems([entity]);
						this.cache.setItem(entity);
						this.completeWithValue(subscriber, entity);
					} else {
						subscriber.error(new Error(`Item with key ${key.id} not found`));
					}
				});
			}
		});
	}

	protected generateUrl(action: string) {
		return `${this.baseUrl}${action}?lookup=${this.lookupType}`;
	}

	/**
	 * Preload data for format or fast input
	 */
	public preLoad$() {
		return this.getList().pipe(map(items => {
			if (!this.cache.loaded) {
				this.cache.setItems(items);
			}
			return items;
		}));
	}

	/**
	 * Resolve search http response
	 * @param response
	 * @protected
	 */
	protected resolveSearchHttpResponse(response: unknown): ILookupSearchHttpResponse {
		if (this.containsSearchList(response)) {
			return response as ILookupSearchHttpResponse;
		}

		return {
			SearchList: response as TItem[]
		} as ILookupSearchHttpResponse;
	}

	/**
	 * Generate search response object
	 * @protected
	 */
	protected generateSearchResponse(res: unknown, cacheKey: string): LookupSearchResponse<TItem> {
		const data = this.resolveSearchHttpResponse(res);
		let entities = (data.SearchList || []).map(item => this.mapEntity(item));

		entities = this.handleList(entities);

		const response = new LookupSearchResponse(entities);

		response.itemsFound = data.RecordsFound;
		response.itemsRetrieved = data.RecordsRetrieved;

		if (this.cache.enableSearchCache) {
			this.cache.setSearchList(cacheKey, response);
		}

		return response;
	}

	/**
	 * Check if response contains search list
	 * @param response
	 * @protected
	 */
	protected containsSearchList(response: unknown): boolean {
		return isObject(response) && has(response, 'SearchList');
	}
}