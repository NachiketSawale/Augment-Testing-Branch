/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {
	IIdentificationData
} from '@libs/platform/common';
import { IBasicUserFormLookupQualifierEntity } from './entities/userform-lookup-qualifier-entity.interface';
import { forEach } from 'lodash';
import { map, Observable, of } from 'rxjs';
/**
 * userform rubric datasource Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformLookupQualifierLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicUserFormLookupQualifierEntity, TEntity> {

	private getItemByKeyQuery = this.configService.webApiBaseUrl + 'basics/userform/qualifier/list';

	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: {
				route: 'basics/userform/qualifier/',
				endPointRead: 'list',
				usePostForRead: false
			}
		}, {
			uuid: '48f331438f0348c48fed867cde439048',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}

	public override processItems(list: IBasicUserFormLookupQualifierEntity[]) {
		forEach(list, (item, index) => {
			list[index] = {
				Id: index + 1,
				Description: item as unknown as string
			};
		});
	}

	/**
	 *
	 * @param key
	 */
	public override getItemByKey(key: IIdentificationData): Observable<IBasicUserFormLookupQualifierEntity> {
		const cacheItem = this.cache.getItem(key);
		if (cacheItem) {
			return of(cacheItem);
		}
		return this.http.get(this.getItemByKeyQuery +  key.id).pipe(map((response) => {
			const entity = response as IBasicUserFormLookupQualifierEntity;
			this.processItems([entity]);
			this.cache.setItem(entity);
			return entity;
		}));
	}

}