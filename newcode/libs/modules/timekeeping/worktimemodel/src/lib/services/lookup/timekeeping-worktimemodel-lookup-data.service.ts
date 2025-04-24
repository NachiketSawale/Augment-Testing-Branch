/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class TimekeepingWorktimemodellookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<TEntity> {
	public constructor() {
		super({httpRead: { route: 'timekeeping/worktimemodel/', endPointRead: 'lookup' }}, {
			uuid: '5700b79cdc7c46d4842d54f080436abd',
			displayMember: 'DescriptionInfo',
			valueMember: 'Id'
		});
	}
}