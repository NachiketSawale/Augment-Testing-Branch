/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowActionInstancePriority } from '../../model/workflow-action-instance-priority.interface';

/**
 * Workflow lookup for workflow action instance priority column.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowActionInstancePriorityLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkflowActionInstancePriority, TEntity> {

	/**
	 * Default constructor to initialize the workflow action instance priority lookup service.
	 */
	public constructor() {
		const endpoint = {httpRead: {route: 'basics/workflow/priority/', endPointRead: 'list'}};
		const config = {
			uuid: '6daab23355c1413fb6ebf4bdb686bb01',
			valueMember: 'Id',
			displayMember: 'Description',
			format: (dataItem: IWorkflowActionInstancePriority) => {
				return dataItem.Description;
			}
		};
		super(endpoint, config);
	}
}