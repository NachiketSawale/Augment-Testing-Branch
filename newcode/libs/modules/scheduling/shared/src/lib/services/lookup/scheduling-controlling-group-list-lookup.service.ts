/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingControllingGroupListLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'controlling/structure/lookup/', endPointRead: 'controllinggroup' }};
		const config = {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'Code',
		};
		super(endpoint, config);
	}
}