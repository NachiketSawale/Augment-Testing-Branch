/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowKind } from '@libs/workflow/shared';

@Injectable({
	providedIn: 'root'
})
export class WorkflowKindLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkflowKind, TEntity> {

	public constructor() {
		const endpoint = {httpRead: { route: 'basics/workflow/kind/', endPointRead: 'list' }};
		const config = {
			uuid: '22ac8586a5a642280278e50a46d8a9c2',
			valueMember: 'Id',
			displayMember: 'Description'
		};
		super(endpoint, config);
	}
}