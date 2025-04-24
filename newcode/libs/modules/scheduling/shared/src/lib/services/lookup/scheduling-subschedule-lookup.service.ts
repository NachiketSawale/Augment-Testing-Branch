/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingSubscheduleLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'scheduling/schedule/', endPointRead: 'listsubscheduleswhichcontainsactivities' }};
		const config = {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'Code',
		};
		super(endpoint, config);
	}
}