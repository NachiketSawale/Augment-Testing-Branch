/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { IFileSelectControlResult, PlatformHttpService } from '@libs/platform/common';
import {
	IInputDialogOptions,
	StandardDialogButtonId,
	UiCommonInputDialogService,
	IMenuItemEventInfo,
	IFileSelectMenuItem,
} from '@libs/ui/common';
import { BasicsWorkflowTemplateDataService } from './basics-workflow-template-data.service';
import { WorkflowTemplateVersionDataService } from './workflow-template-version-data/workflow-template-version-data.service';
import { WorkflowValidationService } from './workflow-validation/workflow-validation.service';
import { TemplateImport } from '@libs/workflow/shared';
import { IWorkflowTemplateVersion, WorkflowTemplate } from '@libs/workflow/interfaces';

/**
 * Service used to import workflow templates.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowUploadService {

	private readonly templateDataService = inject(BasicsWorkflowTemplateDataService);
	private readonly templateVersionDataService = inject(WorkflowTemplateVersionDataService);
	private readonly workflowValidationService = inject(WorkflowValidationService);
	private readonly inputDialogService = inject(UiCommonInputDialogService);
	private readonly httpService = inject(PlatformHttpService);


	/**
	 * Imports the uploaded template from fileselect
	 * @param info
	 */
	public uploadTemplate = (info: IMenuItemEventInfo<void>) => {
		const item = info.item as IFileSelectMenuItem<void>;
		if (item.value) {
			const value = (item.value as IFileSelectControlResult).content;
			if (value) {
				this.importTemplate(value);
			}
		}
	};

	/**
	 * Imports the uploaded templateversion from fileselect
	 * @param info
	 */
	public uploadTemplateVersion = (info: IMenuItemEventInfo<void>) => {
		const item = info.item as IFileSelectMenuItem<void>;
		if (item.value) {
			const value = (item.value as IFileSelectControlResult).content;
			if (value) {
				this.importTemplateVersion(value);
			}
		}
	};

	private async importTemplateVersion(uploadedVersion: string) {
		const source = JSON.parse(uploadedVersion) as IWorkflowTemplateVersion;
		source.WorkflowAction = JSON.stringify(source.WorkflowAction);
		source.Context = JSON.stringify(source.Context);
		const endpoint = 'basics/workflow/template/version/import';
		const httpOptions = {
			source,
			templateId: this.templateDataService.getSelection()[0].Id
		};

		const importedVersion = await this.httpService.post<IWorkflowTemplateVersion>(endpoint, httpOptions);

		this.templateVersionDataService.append(importedVersion);
		this.templateVersionDataService.select(importedVersion);
		this.templateVersionDataService.setModified(importedVersion);
	}

	/**
	 * Imports the uploaded template/ templateversion.
	 * @param importedVersion
	 */
	private async importTemplate(importedVersion: string): Promise<void> {
		const importedTemplate = await this.createTemplateByImport(importedVersion);
		if (importedTemplate) {
			this.templateDataService.append(importedTemplate);
			this.templateDataService.select(importedTemplate);
			this.templateDataService.setModified(importedTemplate);

			//Add new imported template version to template version container and select the first version.
			this.templateVersionDataService.append(importedTemplate.TemplateVersions);
			this.templateVersionDataService.select(importedTemplate.TemplateVersions[0]);
			this.templateVersionDataService.setModified(importedTemplate.TemplateVersions);
		}
	}

	/**
	 * Creates a new template by importing a template version.
	 *
	 * @param importedTemplate Template version to be imported to create as a new workflow template. arguement is a string when data is retrieved from file, it's an object when the funciton is recursively called.
	 * @returns Imported template
	 */
	private async createTemplateByImport(importedTemplate: string | TemplateImport): Promise<WorkflowTemplate | undefined> {

		if (typeof (importedTemplate) === 'string') {
			importedTemplate = JSON.parse(importedTemplate) as TemplateImport;
			importedTemplate.WorkflowAction = JSON.stringify(importedTemplate.WorkflowAction);
		}

		//validate workflow template
		const validationResult = await this.workflowValidationService.validateWorkflowTemplate(importedTemplate);
		if (validationResult.isValid) {

			const endpoint = 'basics/workflow/template/import';
			const httpOptions = {
				importedTemplate
			};
			return this.httpService.post(endpoint, httpOptions);
		} else {
			const options: IInputDialogOptions = {
				headerText: 'basics.workflow.template.errorDialog.templateDescription.header',
				placeholder: '',
				width: '30%',
				maxLength: 64,
				pattern: '/^[0-9]+$/',
				value: importedTemplate.Description
			};
			const result = await this.inputDialogService.showInputDialog(options);
			if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				importedTemplate.Description = result.value;
				return this.createTemplateByImport(importedTemplate);
			}
			return;
		}
	}
}