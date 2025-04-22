/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IValidationResponse, TemplateImport } from '@libs/workflow/shared';
import { ITemplateValidationResult } from '../../model/interfaces/template-validation-result.interface';
import { ActionValidationResult } from '../../model/classes/action-validation-result.class';
import { WorkflowClientActionValidator } from './workflow-action-validation/workflow-client-action-validator.class';
import { IWorkflowTemplateVersion, WorkflowTemplate } from '@libs/workflow/interfaces';
import { WorkflowDefaultTemplate } from '../../constants/workflow-default-template';


@Injectable({
	providedIn: 'root',
})
export class WorkflowValidationService {

	private readonly httpService = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Global variable to hold validations for current selected template version.
	 */
	private templateVersionValidations = new Map<number, ActionValidationResult>;

	public async validateVersion(selectedTemplateVersion: IWorkflowTemplateVersion): Promise<void> {

		this.templateVersionValidations.clear();

		//Selected template version doesn't have any configured actions yet, so no invalid items.
		if (!selectedTemplateVersion.WorkflowAction) {
			selectedTemplateVersion.WorkflowAction = WorkflowDefaultTemplate;
		}
		try {
			//Validate server actions on the server
			await this.validateServerActions(selectedTemplateVersion);
		} catch (e) {
			console.log(e);
		}

		//Validate client actions on the client (actions that are not available on validation map and are not start and end)
		this.validateClientActions(selectedTemplateVersion);
	}

	private async validateServerActions(selectedTemplateVersion: IWorkflowTemplateVersion): Promise<void> {
		const endpoint = 'basics/workflow/v2/template/version/validateWorkflow';
		if (typeof selectedTemplateVersion.WorkflowAction !== 'string') {
			selectedTemplateVersion.WorkflowAction = JSON.stringify(selectedTemplateVersion.WorkflowAction);
		}
		const serverActionValidations = await this.httpService.post<ITemplateValidationResult>(endpoint, selectedTemplateVersion);
		this.addValidationsToMap(serverActionValidations);
	}

	private validateClientActions(selectedTemplateVersion: IWorkflowTemplateVersion): void {
		const clientActionValidator = new WorkflowClientActionValidator([...this.templateVersionValidations.keys()], this.translateService);
		const clientActionValidations = clientActionValidator.validateClientActions(selectedTemplateVersion.WorkflowAction);
		if (clientActionValidations) {
			this.addValidationsToMap(clientActionValidations);
		}
	}

	private addValidationsToMap(validationErrors: ITemplateValidationResult) {
		Object.keys(validationErrors).forEach((key) => this.templateVersionValidations.set(parseInt(key as string), validationErrors[parseInt(key as string)]));
	}

	/**
	 * Gets all the validation errors for the current template
	 * @returns
	 */
	public getValidationErrors(): string {
		let errorHtmlContent = '<br><br>';
		[...this.templateVersionValidations.values()].filter(values => values.ErrorList.length !== 0).forEach(validation => {
			errorHtmlContent += `<section><h2>${validation.ActionDescription}</h2> <ol>`;
			validation.ErrorList.forEach((error) => {
				errorHtmlContent += `<li>${error}</li>`;
			});
			errorHtmlContent += '</ol></section><br>';
		});
		return errorHtmlContent;
	}

	/**
	 * Gets the number of invalid actions in the selected template version.
	 * @returns
	 */
	public getInvalidActionCount(): number {
		return [...this.templateVersionValidations.values()].filter(values => values.ErrorList.length !== 0).length;
	}

	/**
	 * Gets the validation result for the required workflow action.
	 * @param workflowActionId Id of the workflow action.
	 * @returns ActionValidationResult.
	 */
	public getValidationByAction(workflowActionId: number): ActionValidationResult | undefined {
		return this.templateVersionValidations.get(workflowActionId);
	}

	//TODO: Move as platform validations maybe?
	public async validateWorkflowTemplate(workflowTemplate: WorkflowTemplate | TemplateImport): Promise<IValidationResponse> {
		//No description validation
		if (!workflowTemplate.Description) {
			return new Promise(resolve => {
				resolve({
					errorText: 'basics.workflow.template.errorDialog.templateDescription.descriptionEmpty',
					isValid: false
				});
			});
		} else { //Description already exists validation
			const isDescriptionValid = await this.validateWorkflowTemplateDescription(workflowTemplate);
			return {
				errorText: !isDescriptionValid ? 'basics.workflow.template.errorDialog.templateDescription.descriptionExists' : '',
				isValid: isDescriptionValid
			};
		}
	}

	private validateWorkflowTemplateDescription(workflowTemplate: WorkflowTemplate | TemplateImport): Promise<boolean> {
		const endPoint = 'basics/workflow/template/validate/description';
		const httpOptions = {
			description: workflowTemplate.Description,
			id: workflowTemplate.Id
		};
		return this.httpService.get(endPoint, {params: httpOptions});
	}

	public evaluateDisableRefresh() {
		throw new Error('Not yet implemented');
	}
}