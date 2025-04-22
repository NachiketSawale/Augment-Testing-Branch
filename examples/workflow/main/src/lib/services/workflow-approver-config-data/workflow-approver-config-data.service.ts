/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IWorkflowApproverConfigEntity, WorkflowTemplateComplete } from '@libs/workflow/shared';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { BasicsWorkflowTemplateDataService } from '../basics-workflow-template-data.service';

/**
 * Dataservice used for workflow approver config container.
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowApproverConfigDataService extends DataServiceFlatLeaf<IWorkflowApproverConfigEntity,
	WorkflowTemplate, WorkflowTemplateComplete> {
	public constructor() {
		const options: IDataServiceOptions<IWorkflowApproverConfigEntity> = {
			apiUrl: 'basics/workflow/approverconfig',
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowApproverConfigEntity,
				WorkflowTemplate, WorkflowTemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ApproverConfig',
				parent: inject(BasicsWorkflowTemplateDataService)
			},
			readInfo: {
				endPoint: 'listbyparent',
				usePost: true
			}
		};
		super(options);
	}
}
