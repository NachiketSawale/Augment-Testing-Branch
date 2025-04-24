/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { ICosGlobalParamValueEntity } from '../../model/entities/cos-global-param-value-entity.interface';
import { IIdentificationData } from '@libs/platform/common';

/**
 * ConstructionSystem Master Global ParameterValue LookupService
 */
@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedGlobalParameterValueLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICosGlobalParamValueEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('CosGlobalParamValueLookup', {
			uuid: '662dee95c5c54d98bda1df019335e91e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});

	}

	public addList(list: ICosGlobalParamValueEntity[]) {
		this.cache.list.push(...list);
	}

	public override getList(): Observable<ICosGlobalParamValueEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}
	public override getItemByKey(key: IIdentificationData): Observable<ICosGlobalParamValueEntity> {
		return new Observable((observer) => {
			const cacheItem = this.cache.getItem(key);
			if (cacheItem) {
				observer.next(cacheItem);
			} else {
				observer.next();
			}
		});
	}
}
