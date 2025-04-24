/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';

import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterParameterGroupDataService } from '../construction-system-master-parameter-group-data.service';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterParameterGroupLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<ICosParameterGroupEntity, TEntity> {
	private readonly parameterGroupDataService = inject(ConstructionSystemMasterParameterGroupDataService);

	/**
	 * constructor
	 */
	public constructor() {
		// 'CosParameterGroupLookup'
		super([], {
			uuid: '547a5bf07b6a48cdba9b744695e43d99',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showDialog: false,
			showClearButton: false,
		});
	}

	public override getList(): Observable<ICosParameterGroupEntity[]> {
		return new Observable((observer) => {
			const list = this.parameterGroupDataService.getList();
			observer.next(list);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<ICosParameterGroupEntity> {
		return new Observable((observer) => {
			this.getList().subscribe((items) => {
				let foundItem: ICosParameterGroupEntity | undefined | null;
				foundItem = items.find((value) => value.Id === key.id);
				if (!foundItem) {
					foundItem = this.cache.getItem(key);
				}
				if (foundItem) {
					observer.next(foundItem);
					observer.complete();
				} else {
					observer.next();
					observer.complete();
				}
			});
		});
	}
}
