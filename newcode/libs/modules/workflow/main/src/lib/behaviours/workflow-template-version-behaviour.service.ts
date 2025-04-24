/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { TemplateVersionStatus } from '@libs/workflow/shared';
import { IWorkflowTemplateVersion, WorkflowTemplate } from '@libs/workflow/interfaces';
import { WorkflowTemplateVersionDataService } from '../services/workflow-template-version-data/workflow-template-version-data.service';
import { ConcreteMenuItem, DialogDetailsType, IMessageBoxOptions, ItemType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsWorkflowTemplateDataService } from '../services/basics-workflow-template-data.service';
import { HttpResponse } from '@angular/common/http';
import { WorkflowValidationService } from '../services/workflow-validation/workflow-validation.service';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { WorkflowUploadService } from '../services/workflow-upload.service';
import { WorkflowInstanceService } from '../services/workflow-instance/workflow-instance.service';
import { WorkflowDefaultTemplate } from '../constants/workflow-default-template';

//Extending window object to support mozilla and ie urls
declare global {
	interface Window {
		mozURL: string;
		msURL: string;
	}
}

@Injectable({
	providedIn: 'root'
})
export class WorkflowTemplateVersionBehaviour implements IEntityContainerBehavior<IGridContainerLink<IWorkflowTemplateVersion>, IWorkflowTemplateVersion> {

	private readonly templateVersionDataService: WorkflowTemplateVersionDataService = inject(WorkflowTemplateVersionDataService);
	private readonly templateDataService: BasicsWorkflowTemplateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly workflowValidationService: WorkflowValidationService = inject(WorkflowValidationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly workflowUploadService = inject(WorkflowUploadService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly instanceService = inject(WorkflowInstanceService);

	private formatTemplateVersion(): void {
		//while saving template version, convert workflow action back to string.
		const modifiedVersions = this.templateVersionDataService.getModified();
		modifiedVersions.forEach((modifiedVersion) => {
			if (typeof modifiedVersion.WorkflowAction !== 'string') {
				modifiedVersion.WorkflowAction = JSON.stringify(modifiedVersion.WorkflowAction);
			}
			if (typeof modifiedVersion.Context !== 'string') {
				modifiedVersion.Context = JSON.stringify(modifiedVersion.Context);
			}
		});
		this.templateVersionDataService.setModified(modifiedVersions);
	}

	public onCreate(containerLink: IGridContainerLink<IWorkflowTemplateVersion>): void {
		const listUpdated$ = this.templateVersionDataService.listChanged$.subscribe(async data => {
			const templates = this.templateDataService.getSelection();
			if (data.length === 0 && templates.length > 0) {
				const createdTemplate = templates[0];

				const unsavedTemplateVersions = createdTemplate.TemplateVersions;
				unsavedTemplateVersions.forEach(unsavedTemplateVersion => {
					unsavedTemplateVersion.WorkflowTemplateId = createdTemplate.Id;
					unsavedTemplateVersion.WorkflowAction = WorkflowDefaultTemplate;
				});

				containerLink.gridData = unsavedTemplateVersions;
				containerLink.entityModification?.setModified(unsavedTemplateVersions);
			} else {
				await this.templateVersionDataService.select(data.find(version => version.Status === TemplateVersionStatus.Active)?? data[data.length - 1]);
				data.forEach(version => this.prepareStatus(version));
				containerLink.gridData = data;
			}
		});
		containerLink.registerSubscription(listUpdated$);

		//TODO: Remove once save and refresh are available.
		const menuItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'Save'},
				iconClass: 'tlb-icons ico-save',
				type: ItemType.Item,
				fn: () => {
					this.templateVersionDataService.setModified(this.templateVersionDataService.getSelection());
					this.formatTemplateVersion();
				}
			},
			{
				caption: {key: 'cloud.common.toolbarDelete'},
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: async () => {
					const result = await this.messageBoxService.deleteSelectionDialog();
					if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
						this.templateVersionDataService.delete(this.templateVersionDataService.getSelection());
					}
				},
				disabled: () => {
					return isVersionSelected() || this.templateVersionDataService.getList().length <= 1;
				},
				sort: 1
			},
			{
				caption: {key: 'basics.workflow.version.download'},
				iconClass: 'tlb-icons ico-download',
				type: ItemType.Item,
				fn: () => {
					this.downloadVersion(containerLink.entitySelection.getSelection()[0].Id);
				},
				disabled: isVersionSelected,
				sort: 2
			},
			{
				caption: {key: 'basics.workflow.version.upload'},
				iconClass: 'tlb-icons ico-upload',
				type: ItemType.FileSelect,
				fn: this.workflowUploadService.uploadTemplateVersion,
				options: {
					fileFilter: 'application/json',
					maxSize: '2MB',
					retrieveTextContent: true,
					multiSelect: false
				},
				disabled: () => {
					return !this.templateVersionDataService.getSelection();
				},
				sort: 3
			},
			{
				caption: {key: 'basics.workflow.template.version.toolbar.copyVersion'},
				iconClass: 'tlb-icons ico-workflow-copy-version',
				type: ItemType.Item,
				fn: () => this.copyVersion(containerLink),
				disabled: isVersionSelected,
				sort: 4
			},
			{
				caption: {key: 'basics.workflow.template.version.toolbar.validate'},
				iconClass: 'tlb-icons ico-validate-workflow',
				type: ItemType.Item,
				fn: () => this.validateWorkflow(containerLink),
				disabled: isVersionSelected,
				sort: 5
			},
			{
				caption: {key: 'basics.workflow.template.version.toolbar.changeStatus'},
				iconClass: 'tlb-icons ico-change-status',
				type: ItemType.Item,
				fn: () => this.changeStatus(containerLink),
				disabled: isVersionSelected,
				sort: 6
			},
		];

		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems(menuItems);

		function isVersionSelected() {
			return containerLink.entitySelection.getSelection().length < 1;
		}
	}

	//TODO: Select template version by default once template is selected. Unable to select now, as framework code deselects all child entities of parent.
	private selectTemplateVersion(containerLink: IGridContainerLink<IWorkflowTemplateVersion>) {
		if (containerLink.gridData) {
			const activeTemplateVersion = containerLink.gridData.find(t => t.Status === TemplateVersionStatus.Active);

			//Select active template version
			if (activeTemplateVersion) {
				containerLink.entitySelection.select(activeTemplateVersion);
			} else { //Select latest template version
				containerLink.entitySelection.select(containerLink.gridData[containerLink.gridData.length - 1]);
			}
		}
	}

	private downloadVersion(templateVersionId: number) {
		const endpoint: string = 'basics/workflow/template/version/export';
		const httpRequestOptions = {
			params: {versionId: templateVersionId},
			observe: 'response' as 'body'
		};

		this.httpService.post$<HttpResponse<Blob>>(endpoint, {}, httpRequestOptions).subscribe((result) => {
			this.buildAndDownloadFile(result);
		});
	}

	private buildAndDownloadFile<T>(response: HttpResponse<T>) {
		//Prepare file details
		const fileName = response.headers.get('x-filename') || `${(response.body as Partial<WorkflowTemplate> & Partial<IWorkflowTemplateVersion>).Description}.json`;
		const contentType = response.headers.get('content-type') || 'application/octet-stream';

		//Create anchor to download file
		const url = window.URL || window.webkitURL || window.mozURL || window.msURL;
		const link = document.createElement('a');
		document.body.appendChild(link);
		link.setAttribute('display', 'none');

		//Prepare file, attach to anchor and download the file
		const blob = new Blob([JSON.stringify(response.body)], {type: contentType});
		const objectDownloadUrl = url.createObjectURL(blob);
		link.href = objectDownloadUrl;
		link.download = fileName;
		link.click();

		//Remove the anchor
		window.URL.revokeObjectURL(objectDownloadUrl);
		link.remove();
	}

	private importVersion(containerLink: IGridContainerLink<IWorkflowTemplateVersion>) {
		//Get version from a json file from ui
		//const source = JSON.parse('{"Id":1009065,"TemplateVersion":null,"Status":0,"Comment":"comment update","Helptext":null,"Context":"","WorkflowAction":{"id":1,"code":"","description":"Start","documentList":null,"actionTypeId":1,"actionId":"0","priorityId":1,"transitions":[{"id":2,"parameter":null,"workflowAction":{"id":5,"code":"","description":"End","documentList":[],"actionTypeId":2,"actionId":null,"transitions":null,"priorityId":1}}]},"WorkflowTemplateId":1004565,"ValidFrom":null,"ValidTo":null,"RevisionDate":null,"RevisionClerkId":null,"Lifetime":0,"WorkflowTemplate":null,"WorkflowInstanceEntities":[],"ClerkEntity":null,"IncludedScripts":null,"InsertedBy":5269,"InsertedAt":"2024-01-08T07:33:51.807","UpdatedBy":5269,"UpdatedAt":"2024-01-08T07:49:27.343","Version":3,"Description":"[vk] - create new test","CommentText":null,"KindId":2,"TypeId":1,"EntityId":"0","OwnerId":null,"KeyUserId":null,"CompanyId":null,"UseTextModuleTranslation":false,"StatusMatrix":[],"SubscribedEvents":[]}') as IWorkflowTemplateVersion;
		//TODO: Get source file from uploaded template/template version json.
		const source = {} as IWorkflowTemplateVersion;
		source.WorkflowAction = JSON.stringify(source.WorkflowAction);
		source.Context = JSON.stringify(source.Context);
		const endpoint = 'basics/workflow/template/version/import';
		const httpOptions = {
			source,
			templateId: this.templateDataService.getSelection()[0].Id
		};
		this.httpService.post<IWorkflowTemplateVersion>(endpoint, httpOptions).then((importedVersion) => {
			const templateVersions = containerLink.gridData;
			templateVersions?.push(importedVersion);
			containerLink.gridData = templateVersions;
			containerLink.entitySelection.select(importedVersion);
			containerLink.entityModification?.setModified(importedVersion);
		});
	}

	private copyVersion(containerLink: IGridContainerLink<IWorkflowTemplateVersion>) {
		const endpoint = 'basics/workflow/template/version/copy';
		const HttpRequestOptions = {
			params: {id: containerLink.entitySelection.getSelection()[0].Id}
		};
		this.httpService.get<IWorkflowTemplateVersion>(endpoint, HttpRequestOptions).then((copiedTemplateVersion: IWorkflowTemplateVersion) => {
			//TODO:add preprocessors for copied version
			containerLink.entityList?.append(copiedTemplateVersion);
			containerLink.entityModification?.setModified(copiedTemplateVersion);
		});
	}

	private async validateWorkflow(containerLink: IGridContainerLink<IWorkflowTemplateVersion>) {
		//Validate and store validations
		await this.workflowValidationService.validateVersion(containerLink.entitySelection.getSelection()[0]);

		const validationErrors = this.workflowValidationService.getValidationErrors();
		const invalidCount = this.workflowValidationService.getInvalidActionCount();
		const messageOptions: IMessageBoxOptions = {
			bodyText: this.translateService.instant('basics.workflow.workflowAction.errors.invalidActionCount').text.replace('{{invalidActionCount}}', invalidCount.toString()), //`There are ${invalidCount} invalid actions!` ,
			headerText: '',
			details: {
				type: DialogDetailsType.LongText,
				value: validationErrors
			},
			width: '400px'
		};
		this.messageBoxService.showMsgBox(messageOptions);
	}

	private async changeStatus(containerLink: IGridContainerLink<IWorkflowTemplateVersion>) {
		if (this.templateDataService.getModified()) {
			await this.templateDataService.save();
		}

		const endpoint = 'basics/workflow/v2/template/version/changeStatus';
		//const requestType = RequestType.GET;
		const httpRequestOptions = {
			params: {
				id: this.templateVersionDataService.getSelection()[0].Id
			}
		};
		this.httpService.get<IWorkflowTemplateVersion>(endpoint, httpRequestOptions).then((updatedTemplateVersion) => {
			if (containerLink.entityList) {
				const templateVersions = containerLink.entityList.getList().filter((version) => version.Id !== updatedTemplateVersion.Id);
				templateVersions?.push(updatedTemplateVersion);
				containerLink.entityList?.setList(templateVersions);
			}
		});
	}

	private prepareStatus(templateVersion: IWorkflowTemplateVersion) {
		const imageUrl: string = 'icon-size-sm control-icons ico-';
		switch (templateVersion.Status) {
			case TemplateVersionStatus.Active:
				templateVersion.StatusImage = imageUrl + 'active';
				break;
			case TemplateVersionStatus.Design:
				templateVersion.StatusImage = imageUrl + 'design';
				break;
			case TemplateVersionStatus.Inactive:
				templateVersion.StatusImage = imageUrl + 'inactive';
				break;
		}
	}
}