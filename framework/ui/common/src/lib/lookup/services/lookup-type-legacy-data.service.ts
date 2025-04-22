/*
 * Copyright(c) RIB Software GmbH
 */

import { get, isNumber, isBoolean } from 'lodash';
import { Observable } from 'rxjs';

import { IIdentificationData } from '@libs/platform/common';

import { ILookupConfig } from '../model/interfaces/lookup-options.interface';
import { ILookupSearchRequest } from '../model/interfaces/lookup-search-request.interface';
import { ILookupSearchResponse } from '../model/interfaces/lookup-search-response.interface';
import { UiCommonLookupTypeDataService } from './lookup-type-data.service';

/**
 * @deprecated Legacy lookup type implementation, not the suggested way and should be avoided, use {@link UiCommonLookupTypeDataService} instead
 */
export class UiCommonLookupTypeLegacyDataService<TItem extends object, TEntity extends object = object> extends UiCommonLookupTypeDataService<TItem, TEntity> {

	/**
	 * By default, the filter string will be transferred into backend logic which will be used by LINQ query engine to do filtering.
	 * But by enable option, we can only transfer filter parameter object as {@link UiCommonLookupTypeDataService} in safe way, need support in backend!!!
	 * @protected
	 */
	protected filterByParameter = false;
	protected override baseUrl = 'basics/lookupdata/master/';

	/**
	 * service constructor
	 * @param lookupType
	 * @param config
	 */
	public constructor(lookupType: string, config: ILookupConfig<TItem, TEntity>) {
		super(lookupType, config);
		config.isClientSearch = !this.config.showDialog;
	}

	private generateAdditionalFilterString(additionalParameters: object) {
		return Object.keys(additionalParameters).filter((key) => {
			const value = get(additionalParameters, key);
			return isNumber(value) || isBoolean(value);
		}).map(key => {
			const value = get(additionalParameters, key);
			return `${key}=${value}`;
		}).join(' And ');
	}

	private generateFilterString(request: ILookupSearchRequest): string {
		let filterString = request.filterString ?? '';

		if (request.additionalParameters instanceof Object) {
			const additionalFilterString = this.generateAdditionalFilterString(request.additionalParameters);

			if (additionalFilterString) {
				if (filterString) {
					filterString += ' And ';
				}
				filterString += `(${additionalFilterString})`;
			}
		}

		return filterString;
	}

	private stringifySearchRequest(request: ILookupSearchRequest): string {
		request.filterString = undefined;
		return JSON.stringify(request);
	}

	/**
	 * Search lookup entities
	 * @param request
	 * @deprecated use getSearchListAsync instead
	 */
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<TItem>> {
		const payload = this.copyAndAdjustSearchRequest(request);
		let url = this.generateUrl('getsearchlist');
		let filterValue = '';

		if (this.filterByParameter || request.filterByParameter) {
			filterValue = this.stringifySearchRequest(payload);
		} else {
			filterValue = this.generateFilterString(payload);
		}

		const key = filterValue;

		if (filterValue) {
			url += '&filtervalue=' + encodeURIComponent(filterValue);
		}

		return new Observable(subscriber => {
			if (this.cache.enableSearchCache) {
				const searchList = this.cache.getSearchList(key);

				if (searchList) {
					this.completeWithValue(subscriber, searchList);
					return;
				}
			}

			this.get(url).subscribe(list => {
				this.completeWithValue(subscriber, this.generateSearchResponse(list, key));
			});
		});
	}

	/**
	 * get lookup entity by key
	 * @param key
	 * @deprecated use getItemByKeyAsync instead
	 */
	public override getItemByKey(key: IIdentificationData): Observable<TItem> {
		return new Observable(subscriber => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				this.completeWithValue(subscriber, cacheItem);
			} else {
				let url = this.generateUrl('getitembykey');

				url += '&id=' + key.id;

				this.get(url).subscribe(item => {
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
}
