/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	WorkflowTemplateVersionComplete,
	WorkflowTemplateComplete
} from '@libs/workflow/shared';
import { BasicsWorkflowTemplateDataService } from '../basics-workflow-template-data.service';
import { BasicsWorkflowActionDataService } from '../workflow-action/workflow-action.service';
import { IWorkflowTemplateVersion, WorkflowTemplate } from '@libs/workflow/interfaces';

/**
 * Dataservice used for template version container.
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowTemplateVersionDataService extends DataServiceFlatNode<IWorkflowTemplateVersion, WorkflowTemplateVersionComplete,
	WorkflowTemplate, WorkflowTemplateComplete> {

	private readonly actionService = inject(BasicsWorkflowActionDataService);
	private readonly templateService = inject(BasicsWorkflowTemplateDataService);

	public constructor() {
		const options: IDataServiceOptions<IWorkflowTemplateVersion> = {
			apiUrl: 'basics/workflow/v2/template/version',
			readInfo: {
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowTemplateVersion, WorkflowTemplate, WorkflowTemplateComplete>>{
				role: ServiceRole.Node,
				itemName: 'TemplateVersions',
				parent: inject(BasicsWorkflowTemplateDataService)
			}
		};
		super(options);

		this.subscribeToTemplateChanged();
		this.subscribeToTemplateVersionChanged();
		this.subscribeToActionChanged();
	}

	private subscribeToActionChanged() {
		this.actionService.actionsChanged$.subscribe((actionChanged) => {
			if (actionChanged) {
				//while saving template version, convert workflow action back to string.
				const modifiedTemplateVersions = this.actionService.getUpdatedTemplateVersion();
				let modifiedVersions = this.getModified();
				if (!modifiedVersions || modifiedVersions.length === 0) {
					modifiedVersions = this.getList().filter(item => modifiedTemplateVersions.includes(item.Id));
				}
				modifiedVersions.forEach((modifiedVersion) => {
					if (typeof modifiedVersion.WorkflowAction !== 'string') {
						modifiedVersion.WorkflowAction = JSON.stringify(modifiedVersion.WorkflowAction);
					}
					if (typeof modifiedVersion.Context !== 'string') {
						modifiedVersion.Context = JSON.stringify(modifiedVersion.Context);
					}
				});
				this.setModified(modifiedVersions);
			}
		});
	}

	private subscribeToTemplateChanged() {
		this.templateService.listChanged$.subscribe(() => {
			this.clear();
		});
	}

	private subscribeToTemplateVersionChanged() {
		this.selectionChanged$.subscribe((selectedTemplateVersion) => {
			if (selectedTemplateVersion.length > 0) {
				this.actionService.setTemplateVersionId(selectedTemplateVersion[0].Id);
			}
		});
	}

	private clear() {
		this.deselect();
		this.setList([]);
		this.clearModifications();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * createUpdateEntity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IWorkflowTemplateVersion | null): WorkflowTemplateVersionComplete {
		return new WorkflowTemplateVersionComplete(modified);
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: WorkflowTemplateComplete, modified: WorkflowTemplateVersionComplete[], deleted: IWorkflowTemplateVersion[]) {
		if (modified.length > 0) {
			modified.forEach((templateVersionComplete) => {
				if (templateVersionComplete.TemplateVersionsToSave) {
					this.stringifyContextAndWorkflowAction(templateVersionComplete.TemplateVersionsToSave);
				}
			});
			parentUpdate.TemplateVersionsComplete = modified;
		}

		if (deleted.length > 0) {
			this.stringifyContextAndWorkflowAction(deleted);
			parentUpdate.TemplateVersionsToDelete = deleted;
		}
	}

	private stringifyContextAndWorkflowAction(workflowTemplateVersion: IWorkflowTemplateVersion[]): void {
		workflowTemplateVersion.forEach((templateVersionToSave) => {
			if (typeof templateVersionToSave.WorkflowAction !== 'string') {
				templateVersionToSave.WorkflowAction = JSON.stringify(templateVersionToSave.WorkflowAction);
			}
			if (typeof templateVersionToSave.Context !== 'string') {
				templateVersionToSave.Context = JSON.stringify(templateVersionToSave.Context);
			}
		});
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: WorkflowTemplateComplete): IWorkflowTemplateVersion[] {
		const templateVersions: IWorkflowTemplateVersion[] = [];
		parentUpdate.TemplateVersionsComplete.forEach((templateVersionComplete) => {
			templateVersions.push(...templateVersionComplete.TemplateVersionsToSave);
		});
		return templateVersions;
	}

	public override isParentFn(parentKey: WorkflowTemplate, entity: IWorkflowTemplateVersion): boolean {
		return entity.WorkflowTemplateId === parentKey.Id;
	}
}
