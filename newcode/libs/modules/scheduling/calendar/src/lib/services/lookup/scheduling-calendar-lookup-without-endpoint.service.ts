/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingCalendarLookupWithoutEndpoint<TEntity extends object = object> extends UiCommonLookupTypeDataService<TEntity> {
	public constructor() {
		super('schedulingcalendar', {
			//uuid: '48a51acf1180442fa493918fee57f8e1',
			uuid: 'f7d706d43d2b48c8b0a295695da52850',
			displayMember: 'Code',
			valueMember: 'Id'
		});
	}
}