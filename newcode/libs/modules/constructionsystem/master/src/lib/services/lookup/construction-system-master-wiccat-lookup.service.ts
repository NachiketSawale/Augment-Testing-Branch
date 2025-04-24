/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';
import { ICosBoqWicCatBoqFkEntity } from '../../model/entities/cos-boq-wic-cat-boq-fk-entity.interface';

/**
 * ConstructionSystem Master wic cat LookupService
 */
@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterWicCatLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICosBoqWicCatBoqFkEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('BoqWicCatBoqFk', {
			uuid: '672ded05c2c54d99bba2df119335e92e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'WicBoqCat.Code',
			showDialog: false,
			showGrid: false,
		});
	}

	public override getList(): Observable<ICosBoqWicCatBoqFkEntity[]> {
		return new Observable((observer) => {
			const list = this.cache.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<ICosBoqWicCatBoqFkEntity> {
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
