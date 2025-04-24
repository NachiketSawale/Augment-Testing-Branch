/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { IWorkflowApproverInstance } from '@libs/workflow/shared';

@Injectable({
	providedIn: 'root'
})
export class WorkflowApproverInstanceBehaviour implements IEntityContainerBehavior<IGridContainerLink<IWorkflowApproverInstance>, IWorkflowApproverInstance> {

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IWorkflowApproverInstance>) {
		this.deleteItemsFromToolbar(containerLink);
	}

	private deleteItemsFromToolbar(containerLink: IGridContainerLink<IWorkflowApproverInstance>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'grouping', 'print', 'search', 'columnFilter', 'clipboard']);
	}
}