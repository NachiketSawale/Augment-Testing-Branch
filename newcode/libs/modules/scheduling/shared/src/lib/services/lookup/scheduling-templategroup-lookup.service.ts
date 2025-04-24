/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
@Injectable({
	providedIn: 'root'
})
export class SchedulingTemplategroupLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'scheduling/template/activitytemplategroup/', endPointRead: 'list' }};
		const config = {
			uuid: 'ba1b5070e2914046aac80c9dba448e8c',
			valueMember: 'Id',
			displayMember: 'Code',
		};
		super(endpoint, config);
	}
}