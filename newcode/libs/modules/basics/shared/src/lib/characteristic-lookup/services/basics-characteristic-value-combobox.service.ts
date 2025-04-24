/*
 * Copyright(c) RIB Software GmbH
 */
import { find, get } from 'lodash';
import { Injectable } from '@angular/core';
import {
	FieldType,
	ILookupSearchRequest,
	ILookupSearchResponse,
	LookupSearchResponse,
	UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import {  IEntityContext, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import {Observable } from 'rxjs';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicCharacteristicValueDataService } from './basics-characteristic-characteristic-value-data.service';
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicValueComboboxService<TEntity extends object> extends UiCommonLookupReadonlyDataService<ICharacteristicValueEntity, TEntity> {
	public constructor() {
		super(
			{
				uuid: '6c8a131535ab405989c74ca9ca322979',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig: {
					columns: [
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					]
				},
				showGrid: true,
				disableDataCaching: true
			});
	}

	public getList(context?: IEntityContext<TEntity>): Observable<ICharacteristicValueEntity[]> {
		return new Observable<ICharacteristicValueEntity[]>( observer=>{
				if(context) {
					const characteristicId = get(context?.entity, 'Id') as number;
					if(characteristicId) {
						ServiceLocator.injector.get(BasicsSharedCharacteristicCharacteristicValueDataService).getList(characteristicId).subscribe(res => {
							observer.next(res);
							observer.complete();
						});
					} else {
						observer.next();
						observer.complete();
					}
				} else {
					observer.next();
					observer.complete();
				}
			}
		);
	}

	public getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<ICharacteristicValueEntity> {
		return new Observable<ICharacteristicValueEntity>(observer => {
			const cacheItem = this.cache.getItem(key);
			if (cacheItem) {
				observer.next(cacheItem);
				observer.complete();
			} else {
				this.getList(context).subscribe(list => {
					const item = find(list, e => get(e, this.config.valueMember) === key.id);
					observer.next(item);
					observer.complete();
				});
			}
		});
	}

	/**
	 * Search list
	 * @param request
	 * @param context
	 */
	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<ICharacteristicValueEntity>> {
		/// todo estimate case
		return new Observable((observer) => {
			this.getList(context).subscribe(list => {
				observer.next(new LookupSearchResponse(list));
				observer.complete();
			});
		});
	}

}