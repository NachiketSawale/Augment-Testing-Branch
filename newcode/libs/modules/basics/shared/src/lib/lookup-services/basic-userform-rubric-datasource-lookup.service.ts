/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	ILookupSearchRequest,
	UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {
	IIdentificationData
} from '@libs/platform/common';
import { IBasicUserFormRubricDataSourceEntity } from './entities/userform-rubric-datasource-entity.interface';
import { get, forEach } from 'lodash';
import { map, Observable, of } from 'rxjs';
/**
 * userform rubric datasource Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsUserformRubricDataSourceLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicUserFormRubricDataSourceEntity, TEntity> {
	private rubricId: number = 1;
	private getItemByKeyQuery = this.configService.webApiBaseUrl + 'basics/userform/rubric/datasourcelist?rubricId=';
	private processItem: (item: IBasicUserFormRubricDataSourceEntity) => void = (item: IBasicUserFormRubricDataSourceEntity) => {

	};
	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: {
				route: 'basics/userform/rubric/',
				endPointRead: 'datasourcelist',
				usePostForRead: false
			},
			filterParam: true,
			prepareListFilter: () => {
				return 'Id=' + this.rubricId;
			}
		}, {
			uuid: '1359106bb7304855a0ffc10428e3f7a6',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
		this.dataProcessors.push(
			{
				processItem: this.processItem
			}
		);
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const Id = get(request.additionalParameters, 'RubricId');
		this.rubricId = Id ?? 1;
		return 'rubricId=' + this.rubricId;
	}

	public override processItems(list: IBasicUserFormRubricDataSourceEntity[]) {
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
	public override getItemByKey(key: IIdentificationData): Observable<IBasicUserFormRubricDataSourceEntity> {
		const cacheItem = this.cache.getItem(key);
		if (cacheItem) {
			return of(cacheItem);
		}
		return this.http.get(this.getItemByKeyQuery +  key.id).pipe(map((response) => {
			const entity = response as IBasicUserFormRubricDataSourceEntity;
			this.processItems([entity]);
			this.cache.setItem(entity);
			return entity;
		}));
	}

}