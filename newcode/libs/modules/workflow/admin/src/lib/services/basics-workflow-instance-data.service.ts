/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IWorkflowInstance } from '@libs/workflow/interfaces';
import { WorkflowInstanceComplete } from '@libs/workflow/shared';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsWorkflowInstanceDataService extends DataServiceHierarchicalRoot<IWorkflowInstance, WorkflowInstanceComplete> {

	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Initializes data service.
	 */
	public constructor() {
		const option: IDataServiceOptions<IWorkflowInstance> = {
			apiUrl: 'basics/workflow/instance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getTree',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<WorkflowInstanceComplete>>{
				role: ServiceRole.Root,
				itemName: 'Instance',
			},
			converter: {
				convert: (entity) => {
					return {
						id: entity.Id,
						pKey1: entity.TemplateId
					};
				}
			}
		};

		super(option);
	}

	/**
	 * Escalate all selected Workflows
	 */
	public escalateWorkflow() {
		const selectedItems = this.getSelection();
		const ids = selectedItems.map(item => item.Id.toString());
		return this.httpService.post('basics/workflow/instance/escalateInBulk', ids);
	}

	/**
	 * Kill all selected running Workflows
	 */
	public killWorkflow() {
		const selectedItems = this.getSelection();
		const ids = selectedItems.map(item => item.Id.toString());

		return this.httpService.post('basics/workflow/instance/killinbulk', ids);
	}

	//TODO readonly dataService remove when readonly service is functional
	public override createUpdateEntity(modified: IWorkflowInstance | null): WorkflowInstanceComplete {
		return {} as WorkflowInstanceComplete;
	}

	public override childrenOf(element: IWorkflowInstance): IWorkflowInstance[] {
		return element.Children ?? [];
	}
}