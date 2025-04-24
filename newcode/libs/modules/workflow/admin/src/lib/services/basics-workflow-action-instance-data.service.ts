/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { WorkflowInstanceComplete } from '@libs/workflow/shared';
import { IWorkflowInstance } from '@libs/workflow/interfaces';
import { IWorkflowActionInstanceHistory } from '@libs/workflow/shared';
import { Injectable } from '@angular/core';
import { BasicsWorkflowInstanceDataService } from './basics-workflow-instance-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsWorkflowActionInstanceDataService extends DataServiceFlatLeaf<IWorkflowActionInstanceHistory,
	IWorkflowInstance, WorkflowInstanceComplete> {

	/**
	 * Initializes data service.
	 */
	public constructor(basicsWorkflowInstanceDataService: BasicsWorkflowInstanceDataService) {
		const option: IDataServiceOptions<IWorkflowActionInstanceHistory> = {
			apiUrl: 'basics/workflow/instance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'history',
				usePost: false,
				prepareParam: ident => {
					return {workflowInstanceId: ident.id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowActionInstanceHistory, IWorkflowInstance, WorkflowInstanceComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Plant',
				parent: basicsWorkflowInstanceDataService
			},
		};
		super(option);
	}
}