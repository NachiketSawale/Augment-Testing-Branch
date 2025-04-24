/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowActionInstanceStatus } from '../../model/workflow-action-instance-status.interface';

/**
 * Workflow lookup for workflow action instance status column.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowActionInstanceStatusLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkflowActionInstanceStatus, TEntity> {

	/**
	 * Default constructor to initialize the workflow action instance priority lookup service.
	 */
	public constructor() {
		const endpoint = {httpRead: {route: 'basics/workflow/action/status/', endPointRead: 'list'}};
		const config = {
			uuid: '22155068254147f1939e9316b867c707',
			valueMember: 'Id',
			displayMember: 'Description',
			format: (dataItem: IWorkflowActionInstanceStatus) => {
				return dataItem.Description;
			}
		};
		super(endpoint, config);
	}
}