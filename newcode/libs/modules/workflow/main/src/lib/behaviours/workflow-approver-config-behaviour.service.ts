/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IWorkflowApproverConfigEntity } from '@libs/workflow/shared';
import { WorkflowApproverConfigDataService } from '../services/workflow-approver-config-data/workflow-approver-config-data.service';
import { Injectable, inject } from '@angular/core';


/**
 * Behaviour used to control workflow approver configuration grid.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowApproverBehaviour implements IEntityContainerBehavior<IGridContainerLink<IWorkflowApproverConfigEntity>, IWorkflowApproverConfigEntity> {

	private workflowApproverConfigDataService: WorkflowApproverConfigDataService;
	

	public constructor() {
		this.workflowApproverConfigDataService = inject(WorkflowApproverConfigDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IWorkflowApproverConfigEntity>): void {
		const workflowApproverConfigServiceSub = this.workflowApproverConfigDataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(workflowApproverConfigServiceSub);
	}

	public onInit(containerLink: IGridContainerLink<IWorkflowApproverConfigEntity>): void {
	}

}