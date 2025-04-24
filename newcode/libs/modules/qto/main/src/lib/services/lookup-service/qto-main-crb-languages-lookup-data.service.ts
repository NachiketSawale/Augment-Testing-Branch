/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class QtoMainCrbLanguagesLookupDataService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const items: LookupSimpleEntity[] = [new LookupSimpleEntity(2, 'Deutsch'), new LookupSimpleEntity(7, 'Français'), new LookupSimpleEntity(10, 'Italiano')];
		super(items, { uuid: '98C95BB34DAB41DD8801B0E85F23D778', displayMember: 'description', valueMember: 'id' });
	}
}
