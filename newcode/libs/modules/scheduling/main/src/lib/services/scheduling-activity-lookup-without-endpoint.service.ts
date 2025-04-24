/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingActivityLookupWithoutEndpoint<TEntity extends object = object> extends UiCommonLookupTypeDataService<TEntity> {
	public constructor() {
		super('schedulingactivitynew', {
			uuid: '48a51acf1180442fa493918fee57f8e1',
			displayMember: 'Code',
			valueMember: 'Id'
		});
	}
}