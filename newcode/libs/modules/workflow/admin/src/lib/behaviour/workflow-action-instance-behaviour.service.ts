/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { IWorkflowActionInstanceHistory } from '@libs/workflow/shared';

@Injectable({
	providedIn: 'root'
})
export class WorkflowActionInstanceBehaviour implements IEntityContainerBehavior<IGridContainerLink<IWorkflowActionInstanceHistory>, IWorkflowActionInstanceHistory> {

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IWorkflowActionInstanceHistory>) {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IWorkflowActionInstanceHistory>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'grouping', 'print', 'search', 'columnFilter', 'clipboard']);
	}
}