/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IWorkflowClientActionInstanceInterface } from '../model/interfaces/workflow-client-action-instance.interface';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { BasicsWorkflowClientActionInstanceDataService } from '../services/basics-workflow-client-action-instance-data.service';

@Injectable({
	providedIn: 'root'
})
export class WorkflowClientActionInstanceBehaviourService implements IEntityContainerBehavior<IGridContainerLink<IWorkflowClientActionInstanceInterface>, IWorkflowClientActionInstanceInterface> {

	private clientActionInstanceDataService = inject(BasicsWorkflowClientActionInstanceDataService);

	/**
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IWorkflowClientActionInstanceInterface>) {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<IWorkflowClientActionInstanceInterface>){
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'Overdue'},
				iconClass: 'tlb-icons ico-date',
				type: ItemType.Item,
				fn: () => this.getOverdueList(containerLink),
			},
			{
				caption: {key: 'Get List'},
				iconClass: 'tlb-icons ico-refresh',
				type: ItemType.Item,
				fn: () => this.getClientList(containerLink),
			}
		];
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}

	private getOverdueList(containerLink: IGridContainerLink<IWorkflowClientActionInstanceInterface>){
		this.clientActionInstanceDataService.getOverdueClientList().then((response => {
			containerLink.gridData = response;
		}));
	}

	private getClientList(containerLink: IGridContainerLink<IWorkflowClientActionInstanceInterface>) {
		this.clientActionInstanceDataService.getClientList().then((response => {
			containerLink.gridData = response;
		}));
	}
}