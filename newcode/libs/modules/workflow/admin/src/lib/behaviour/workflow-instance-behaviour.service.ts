/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IWorkflowInstance } from '@libs/workflow/interfaces';
import { inject, Injectable } from '@angular/core';
import { BasicsWorkflowInstanceDataService } from '../services/basics-workflow-instance-data.service';

import { ConcreteMenuItem, ItemType } from '@libs/ui/common';


@Injectable({
	providedIn: 'root'
})
export class WorkflowInstanceBehaviourService implements IEntityContainerBehavior<IGridContainerLink<IWorkflowInstance>, IWorkflowInstance> {
	private instanceDataService = inject(BasicsWorkflowInstanceDataService);

	private disableButton: boolean = true;

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IWorkflowInstance>) {
		const selectionChanged$ = this.instanceDataService.selectionChanged$.subscribe((data) => {
			this.disableButton = !(data.length > 0);
		});
		containerLink.registerSubscription(selectionChanged$);
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IWorkflowInstance>) {
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'Escalate'},
				iconClass: 'tlb-icons ico-active-directory-import',
				type: ItemType.Item,
				fn: () => this.escalateWorkflow(),
				disabled: () => {
					return this.disableButton;
				},
				sort: 201
			},
			{
				caption: {key: 'Kill'},
				iconClass: 'tlb-icons ico-workflow-cancel',
				type: ItemType.Item,
				fn: () => this.killWorkflow(),
				disabled: () => {
					return this.disableButton;
				},
				sort: 202
			}
		];
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}

	private escalateWorkflow() {
		this.disableButton = true;
		this.instanceDataService.escalateWorkflow().then(() => {
			this.disableButton = false;
		});
	}

	private killWorkflow() {
		this.disableButton = true;
		this.instanceDataService.killWorkflow().then(() => {
			this.disableButton = false;
		});
	}
}