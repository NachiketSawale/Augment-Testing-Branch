/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AggregateTypeService } from '@libs/constructionsystem/shared';
import { IIdentificationData, Translatable } from '@libs/platform/common';
import { ILookupSearchRequest, ILookupSearchResponse, UiCommonLookupItemsDataService } from '@libs/ui/common';

type IAggregateTypeEntity = { Id: number; Description: Translatable };

@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterParameterAggregateTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IAggregateTypeEntity, TEntity> {
	private readonly aggregateTypeService = inject(AggregateTypeService);

	public constructor() {
		// 'constructionSystemMasterAggregateType'
		super([], {
			uuid: '9eedf7e88fa340cf98742f92d919ea66',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});
		this.setItems(this.aggregateTypeService.getList());
	}

	public override getItemByKey(key: IIdentificationData): Observable<IAggregateTypeEntity> {
		return new Observable((observer) => {
			// todo-allen: this.getList or this.aggregateTypeService.getList() ?
			this.getList().subscribe((items) => {
				let foundItem: IAggregateTypeEntity | undefined | null;
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

	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IAggregateTypeEntity>> {
		return super.getSearchList(request);
	}
}
