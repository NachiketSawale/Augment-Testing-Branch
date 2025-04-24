/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IWorkflowTemplateContext, WorkflowTemplateVersionComplete,
} from '@libs/workflow/shared';
import { IWorkflowTemplateVersion } from '@libs/workflow/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import {
	WorkflowTemplateVersionDataService
} from '../workflow-template-version-data/workflow-template-version-data.service';


/**
 * Dataservice used for TemplateContext
 */
@Injectable({
	providedIn: 'root',
})
export class WorkflowTemplateContextService extends DataServiceFlatLeaf<IWorkflowTemplateContext, IWorkflowTemplateVersion, WorkflowTemplateVersionComplete> {

	private templateVersionService = inject(WorkflowTemplateVersionDataService);

	public constructor() {

		const options: IDataServiceOptions<IWorkflowTemplateContext> = {
			apiUrl: '',
			roleInfo: <IDataServiceChildRoleOptions<IWorkflowTemplateContext, IWorkflowTemplateVersion, WorkflowTemplateVersionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'TemplateContext',
				parent: inject(WorkflowTemplateVersionDataService)
			},
			readInfo: {
				endPoint: '',
				usePost: true
			},
			provider: {
				load(identificationData: IIdentificationData | null): Promise<IWorkflowTemplateContext[]> {
					return self.loadData(identificationData);
				},
				create(identificationData: IIdentificationData | null): Promise<IWorkflowTemplateContext> {
					const id = Math.floor((1 + Math.random()) * 0x10000);
					return Promise.resolve({ id: id, Id: id, key: '', value: '' });
				}
			},
			processors: [{
				process(toProcess: IWorkflowTemplateContext) {
					toProcess = { id: toProcess.id, Id: toProcess.Id, key: toProcess.key, value: toProcess.value };
				},
				revertProcess(toProcess: IWorkflowTemplateContext) {

				}
			}]
		};
		super(options);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self: WorkflowTemplateContextService = this;
	}

	public loadData(identificationData: IIdentificationData | null): Promise<IWorkflowTemplateContext[]> {
		const selectedTemplateVersion = this.templateVersionService.getSelection()[0];
		const templateContexts: IWorkflowTemplateContext[] | string = JSON.parse(selectedTemplateVersion.Context) as IWorkflowTemplateContext[];
		if(typeof templateContexts === 'string') {
			return Promise.resolve([]);
		}
		templateContexts.forEach((item) => {
			item.Id = item.id;
		});
		return Promise.resolve(templateContexts);
	}

	public override registerModificationsToParentUpdate(parentUpdate: WorkflowTemplateVersionComplete, modified: IWorkflowTemplateContext[], deleted: IWorkflowTemplateContext[]) {
		console.log(parentUpdate);
	}

	public override collectModificationsForParentUpdate(parentUpdate: WorkflowTemplateVersionComplete, parent: IWorkflowTemplateVersion) {
		if (this.getModified().length > 0) {

			const templateVersion = this.templateVersionService.getSelection()[0];
			const modifiedTempateVersion = parentUpdate.TemplateVersionsToSave.filter((item)=>item.Id === templateVersion.Id)[0];

			this.getList().map((item) => {
				delete item.Id;
			});

			if(modifiedTempateVersion) {
				modifiedTempateVersion.Context = JSON.stringify(this.getList());
				return;
			}

			templateVersion.Context = JSON.stringify(this.getList());
			templateVersion.WorkflowAction = JSON.stringify(templateVersion.WorkflowAction);
			parentUpdate.TemplateVersionsToSave.push(templateVersion);
		}
	}

}