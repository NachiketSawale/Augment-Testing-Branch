/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';

import { IIdentificationData } from '@libs/platform/common';

import {LookupSearchResponse} from '../model/lookup-search-response';
import {ILookupSearchRequest} from '../model/interfaces/lookup-search-request.interface';
import {ILookupSearchResponse} from '../model/interfaces/lookup-search-response.interface';
import {UiCommonLookupReadonlyDataService} from './lookup-readonly-data.service';
import {ILookupConfig} from '../model/interfaces/lookup-options.interface';


/*
 * Lookup data service base for hardcode array
 */
export class UiCommonLookupItemsDataService<TItem extends object, TEntity extends object = object> extends UiCommonLookupReadonlyDataService<TItem, TEntity> {
	protected items: TItem[] = [];

	public constructor(items: TItem[], config: ILookupConfig<TItem, TEntity>) {
		super(config);
		this.config.isClientSearch = true;
		this.config.searchSync = true;
		this.setItems(items);
		this.syncService = {
			getListSync: () => {
				return this.items;
			}
		};
	}

	public getItems() {
		return this.items;
	}

	public setItems(items: TItem[]) {
		this.items = items;
		this.processItems(items);
	}

	public getList(): Observable<TItem[]> {
		return new Observable((observer) => {
			observer.next(this.items);
			observer.complete();
		});
	}

	public getItemByKey(id: IIdentificationData): Observable<TItem> {
		return new Observable((observer) => {
			this.items.forEach(item => {
				const i = this.identify(item);
				if (i.id === id.id) {
					observer.next(item);
				}
			});
			observer.complete();
		});
	}

	public getSearchList(filter: ILookupSearchRequest): Observable<ILookupSearchResponse<TItem>> {
		return new Observable((observer) => {
			observer.next(new LookupSearchResponse(this.items));
			observer.complete();
		});
	}
}