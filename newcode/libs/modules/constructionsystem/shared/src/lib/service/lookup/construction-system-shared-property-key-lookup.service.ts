/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPropertyKeyEntity } from '../../model/entities/property-key-entity.interface';

/**
 * PropertyKey LookupService
 */
@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedPropertyKeyLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPropertyKeyEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('MdlAdministrationPropertyKeys', {
			uuid: '682def05c2c54d99bba2df119455e92e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'PropertyName',
			showDialog: false,
			showGrid: false,
		});
	}

	public override getList(): Observable<IPropertyKeyEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<IPropertyKeyEntity> {
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
