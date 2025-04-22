/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { LazyInjectable } from '@libs/platform/common';
import { IWorkflowEntityDataFacadeLookupService, IWorkflowEntityDataFacade, WORKFLOW_ENTITY_DATA_FACADE_LOOKUP_SERVICE } from '@libs/workflow/interfaces';


@LazyInjectable({
	token: WORKFLOW_ENTITY_DATA_FACADE_LOOKUP_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityDataFacadeLookupService<T extends object> extends UiCommonLookupEndpointDataService<IWorkflowEntityDataFacade, T> implements IWorkflowEntityDataFacadeLookupService<T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<IWorkflowEntityDataFacade, T> = {
			httpRead: {route: 'basics/workflow/data/entity/', endPointRead: 'list'}

		};
		super(lookupEndpointConfig, {
			uuid: 'ee9f50d284b64120b367df5d094d0eb4',
			displayMember: 'EntityName',
			valueMember: 'Id'
		});
	}
}