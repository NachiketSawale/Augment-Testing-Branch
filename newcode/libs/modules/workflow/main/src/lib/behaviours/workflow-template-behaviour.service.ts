/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsWorkflowTemplateDataService } from '../services/basics-workflow-template-data.service';
import { Injectable, inject } from '@angular/core';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import {
	ConcreteMenuItem,
	IInputDialogOptions,
	ItemType,
	StandardDialogButtonId,
	UiCommonInputDialogService,
	UiCommonMessageBoxService,
} from '@libs/ui/common';

import { IAccessRightDescriptor } from '@libs/workflow/shared';
import { IBaseContext, IWorkflowInstance, WorkflowTemplate, WorkflowInstanceStatus } from '@libs/workflow/interfaces';
import { WorkflowInstanceService } from '../services/workflow-instance/workflow-instance.service';
import {
	WorkflowTemplateVersionDataService
} from '../services/workflow-template-version-data/workflow-template-version-data.service';
import { StartEntityWorkflowService } from '../services/start-entity-workflow.service';
import { WorkflowUploadService } from '../services/workflow-upload.service';

@Injectable({
	providedIn: 'root'
})
export class WorkflowTemplateBehaviourService implements IEntityContainerBehavior<IGridContainerLink<WorkflowTemplate>, WorkflowTemplate> {

	private readonly templateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly workflowInstanceService = inject(WorkflowInstanceService);
	private readonly inputDialogService = inject(UiCommonInputDialogService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly workflowTemplateVersionService = inject(WorkflowTemplateVersionDataService);
	private readonly startEntityWorkflowService = inject(StartEntityWorkflowService);
	private readonly workflowUploadService = inject(WorkflowUploadService);
	private readonly httpService = inject(PlatformHttpService);

	/*
	 * On container creation callback
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<WorkflowTemplate>): void {
		this.addItemsToToolbar(containerLink);
	}

	private addItemsToToolbar(containerLink: IGridContainerLink<WorkflowTemplate>) {

		//TODO: Remove once save and refresh are available.
		const customToolbarItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'cloud.common.toolbarSave'},
				iconClass: 'tlb-icons ico-save',
				type: ItemType.Item,
				fn: this.saveTemplate
			},
			{
				caption: {key: 'cloud.common.toolbarInsert'},
				iconClass: 'tlb-icons ico-rec-new',
				type: ItemType.Item,
				fn: () => this.createTemplate(containerLink),
				sort: 1
			},
			{
				caption: {key: 'cloud.common.toolbarDelete'},
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: async () => {
					const result = await this.messageBoxService.deleteSelectionDialog();
					if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
						//Delete dependencies
						this.workflowTemplateVersionService.setDeleted(this.workflowTemplateVersionService.getList());
						await this.templateDataService.save();

						//Delete template
						this.templateDataService.delete(this.templateDataService.getSelection());

						//Clearing dependent containers
						this.workflowTemplateVersionService.setList([]);
						this.workflowTemplateVersionService.select(null);
					}
				},
				disabled: () => {
					return !this.templateDataService.canDelete();
				},
				sort: 2
			},
			{
				caption: {key: 'basics.workflow.version.createByVersion'},
				iconClass: 'tlb-icons ico-upload',
				type: ItemType.FileSelect,
				fn: this.workflowUploadService.uploadTemplate,
				sort: 3,
				options: {
					fileFilter: 'application/json',
					maxSize: '2MB',
					retrieveTextContent: true,
					multiSelect: false
				}
			},
			{
				caption: {key: 'basics.workflow.template.startWorkflow'},
				iconClass: 'tlb-icons ico-workflow-run',
				type: ItemType.Item,
				fn: () => this.startWorkflow(),
				sort: 4
			},
			{
				caption: {key: 'basics.workflow.template.addAccessRightDescriptor'},
				iconClass: 'tlb-icons ico-right-add',
				type: ItemType.Item,
				fn: async () => {
					//Get these values from translation
					const options: IInputDialogOptions = {
						headerText: 'basics.workflow.template.enterAccessRightDescriptorName',
						placeholder: 'basics.workflow.template.plsEnterName',
						width: '30%',
						maxLength: 64,
						pattern: '/^[0-9]+$/'
					};
					const result = await this.inputDialogService.showInputDialog(options);
					if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						this.createAccessRightDescriptor(result.value);
					}

				},
				disabled: () => {
					return !this.templateDataService.getSelection()[0] || (this.templateDataService.getSelection()[0].AccessRightDescriptorFk !== null && this.templateDataService.getSelection()[0].AccessRightDescriptorFk !== undefined);
				},
				sort: 5
			},
			{
				caption: {key: 'basics.workflow.template.deleteAccessRightDescriptor'},
				iconClass: 'tlb-icons ico-right-delete',
				type: ItemType.Item,
				fn: () => this.deleteAccessRightDescriptor(),
				disabled: () => {
					return !this.templateDataService.getSelection()[0] || this.templateDataService.getSelection()[0].AccessRightDescriptorFk === undefined || this.templateDataService.getSelection()[0].AccessRightDescriptorFk === null;
				},
				sort: 6
			}
		];

		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
		containerLink.uiAddOns.navigation.addNavigator({
			displayText: 'ui.business-base.navigator.workflowAdmin',
			internalModuleName: 'basics.workflowAdministration',
			entityIdentifications: () => {
				return [{id: this.templateDataService.getSelection()[0].Id}];
			},
			onNavigationDone: () => {
				console.log('navigation to workflowAdministration happened');
			}
		});
	}

	private saveTemplate = () => {
		this.formatTemplateVersion();
		this.templateDataService.save();
	};

	private formatTemplateVersion(): void {
		//while saving template version, convert workflow action back to string.
		const modifiedVersions = this.workflowTemplateVersionService.getModified();
		modifiedVersions.forEach((modifiedVersion) => {
			if (typeof modifiedVersion.WorkflowAction !== 'string') {
				modifiedVersion.WorkflowAction = JSON.stringify(modifiedVersion.WorkflowAction);
			}
			if (typeof modifiedVersion.Context !== 'string') {
				modifiedVersion.Context = JSON.stringify(modifiedVersion.Context);
			}
		});
		this.workflowTemplateVersionService.setModified(modifiedVersions);
	}

	private async createTemplate(containerLink: IGridContainerLink<WorkflowTemplate>): Promise<void> {
		const newTemplateEntity = await this.templateDataService.create();
		containerLink.entityModification?.setModified(newTemplateEntity);
	}

	private async startWorkflow(): Promise<void> {
		const selectedEntity = this.templateDataService.getSelection()[0];

		const handleError = (response: IWorkflowInstance | undefined) => {
			if (response && response.Status === WorkflowInstanceStatus.Failed) {
				const context: IBaseContext = JSON.parse(response.Context);
				this.messageBoxService.showErrorDialog(context.Exception);
			}
		};

		let identificationData: IIdentificationData | undefined = undefined;
		const startWorkflowFn = () => this.workflowInstanceService.startWorkflow(selectedEntity.Id, identificationData, JSON.stringify({currentModuleName: 'basics.workflow'})).then(handleError);

		if (selectedEntity && selectedEntity.Id) {
			if (selectedEntity.EntityId !== '0') {
				const result = await this.startEntityWorkflowService.show();
				if (result && result.closingButtonId == StandardDialogButtonId.Ok && result.value) {
					identificationData = result.value;
					startWorkflowFn();
				}
			} else {
				startWorkflowFn();
			}
		}
	}

	private async createAccessRightDescriptor(accessName: string): Promise<void> {
		const selectedEntity = this.templateDataService.getSelection()[0];
		const templateDataService = this.templateDataService;
		const endpoint: string = 'basics/customize/special/createaccessrightwithmask';
		const httpOptions = {
			DescriptorDesc: selectedEntity.Description.substring(0, 254),
			Name: (accessName ? accessName : selectedEntity.Description).substring(0, 63),
			SortOrderPath: '/Workflow Templates',
			AccessMask: 4112,
			ModuleName: 'basics.workflow'
		};
		const result = await this.httpService.post<IAccessRightDescriptor>(endpoint, httpOptions);
		if (result && result.Id) {
			selectedEntity.AccessRightDescriptorFk = result.Id;
			templateDataService.setModified(selectedEntity);
			await templateDataService.save();
		}
	}

	private async deleteAccessRightDescriptor(): Promise<void> {
		const selectedEntity = this.templateDataService.getSelection()[0];
		const accessId = selectedEntity.AccessRightDescriptorFk;
		if (accessId) {
			//remove from template
			selectedEntity.AccessRightDescriptorFk = undefined;
			this.templateDataService.setModified(selectedEntity);
			await this.templateDataService.save();
			//remove from access
			const endpoint = 'basics/customize/special/deleteaccessrightbyid';
			this.httpService.get(endpoint, {params: {id: accessId}});
		}
	}
}