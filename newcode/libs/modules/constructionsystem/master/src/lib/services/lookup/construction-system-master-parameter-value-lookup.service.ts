/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { ILookupSearchRequest, ILookupSearchResponse, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { ConstructionSystemMasterParameterValueDataService } from '../construction-system-master-parameter-value-data.service';
import { ICosParameterValueEntity } from '@libs/constructionsystem/shared';

/**
 * CosParameterValueLookup
 */
@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterParameterValueLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<ICosParameterValueEntity, TEntity> {
	private readonly parameterValueDataService = inject(ConstructionSystemMasterParameterValueDataService);

	/**
	 * constructor
	 */
	public constructor() {
		super([], {
			uuid: '630dee95c5c54d98bda1df019335e92e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showDialog: false,
		});
	}

	public override getList(): Observable<ICosParameterValueEntity[]> {
		return new Observable((observer) => {
			const items = this.parameterValueDataService.getList();
			this.setItems(items);
			observer.next(items);
		});
	}

	public override getItemByKey(key: IIdentificationData): Observable<ICosParameterValueEntity> {
		return new Observable((observer) => {
			this.getList().subscribe((items) => {
				let foundItem: ICosParameterValueEntity | undefined | null;
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

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<ICosParameterValueEntity>> {
		return super.getSearchList(request); // todo: getList()
	}
}
