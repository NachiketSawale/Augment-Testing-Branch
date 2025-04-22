/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { DataServiceFlatRoot } from '@libs/platform/data-access';
import { WorkflowTemplateComplete } from '@libs/workflow/shared';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsWorkflowActionDataService } from './workflow-action/workflow-action.service';

/**
 * Data service used to load workflow template data.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsWorkflowTemplateDataService extends DataServiceFlatRoot<WorkflowTemplate, WorkflowTemplateComplete> {

	private readonly actionService = inject(BasicsWorkflowActionDataService);

	/**
	 * Initializes data service.
	 */
	public constructor() {
		const options: IDataServiceOptions<WorkflowTemplate> = {
			apiUrl: 'basics/workflow/v2/template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			createInfo: {
				endPoint: 'create'
			},
			roleInfo: <IDataServiceRoleOptions<WorkflowTemplateComplete>>{
				role: ServiceRole.Root,
				itemName: 'Template',
			}
		};

		super(options);
		this.subscribeToTemplateChanged();
	}

	public override createUpdateEntity(modified: WorkflowTemplate | null): WorkflowTemplateComplete {
		return new WorkflowTemplateComplete(modified);
	}

	public override getModificationsFromUpdate(complete: WorkflowTemplateComplete): WorkflowTemplate[] {
		return complete.Templates ?? [];
	}

	public override save(): Promise<void> {
		// Check if all containers have any change.
		this.actionService.haveActionsChanged();
		super.save();
		this.actionService.clearActionState();
		return Promise.resolve();
	}

	private subscribeToTemplateChanged() {
		this.listChanged$.subscribe(() => {
			//TODO: Add modified check before save
			//this.save();
		});
	}
}
