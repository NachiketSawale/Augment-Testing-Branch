/**
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ITaskListFilterDefinition } from '@libs/workflow/interfaces';

/*
 * TaskList save lookup
 */
@Injectable({
	providedIn: 'root'
})
export class UiSidebarTaskFilterLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ITaskListFilterDefinition, TEntity> {

	public constructor() {
		const endpoint = {httpRead: {route: 'basics/workflow/filter/', endPointRead: 'getfilterdefinitions?moduleName=basics.workflow'}};
		const config = {
			uuid: 'd40708ff247e45eb80d85d01cfb2086f',
			valueMember: 'filterName',
			displayMember: 'filterName',
			headerValue: 'filterName',
			value: 'filterName'
		};
		super(endpoint, config);
	}
}