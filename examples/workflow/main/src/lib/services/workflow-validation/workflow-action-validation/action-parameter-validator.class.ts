/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformTranslateService } from '@libs/platform/common';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { WorkflowClientAction, IWorkflowAction } from '@libs/workflow/interfaces';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';

/**
 * Validates if input and output parameters are proper
 */
export class ActionParameterValidator implements IClientActionValidator {

	/**
	 * Constructs validator with required properties
	 * @param actionValidationResult
	 * @param translateService
	 * @param clientActions
	 * @param workflowAction
	 */
	public constructor(private actionValidationResult: ActionValidationResult, private translateService: PlatformTranslateService, private clientActions: WorkflowClientActions, private workflowAction: IWorkflowAction) {

	}

	/**
	 * Gets the active version of the client version
	 * @returns
	 */
	private getClientAction() {
		return this.clientActions.getClientActionById(this.workflowAction.actionId as WorkflowClientAction);
	}

	/**
	 * Validates if input and output parameters are proper
	 */
	public validate() {
		//Validate input parameters
		this.validateInputParameters(this.workflowAction.input.map(param => param.key), this.getClientAction().Input, this.actionValidationResult);
		//Validate output parameters
		this.validateOutputParameters(this.workflowAction.output.map(param => param.key), this.getClientAction().Output, this.actionValidationResult);
	}

	private validateInputParameters(existingParams: string[], activeParams: string[], actionValidationResult: ActionValidationResult) {
		const addedParams = activeParams.filter((activeParam) => !existingParams.includes(activeParam));
		if (addedParams.length > 0) {
			actionValidationResult.InputParams.AddedParams = addedParams;
			actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionNewParam').text} ${addedParams.join(',')}.`);
		}

		const removedParams = existingParams.filter(existingParam => !activeParams.includes(existingParam));
		if (removedParams.length > 0) {
			actionValidationResult.InputParams.RemovedParams = removedParams;
			actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionNonexistentParam').text} ${removedParams.join(',')}.`);
		}

		actionValidationResult.IsParamUpdated = addedParams.length > 0 || removedParams.length > 0;
	}

	private validateOutputParameters(existingParams: string[], activeParams: string[], actionValidationResult: ActionValidationResult) {
		const addedParams = activeParams.filter((activeParam) => !existingParams.includes(activeParam));
		if (addedParams.length > 0) {
			actionValidationResult.OutputParams.AddedParams = addedParams;
			actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionNewParam').text} ${addedParams.join(',')}.`);
		}

		const removedParams = existingParams.filter(existingParam => !activeParams.includes(existingParam));
		if (removedParams.length > 0) {
			actionValidationResult.OutputParams.RemovedParams = removedParams;
			actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionNonexistentParam').text} ${removedParams.join(',')}.`);
		}

		actionValidationResult.IsParamUpdated = addedParams.length > 0 || removedParams.length > 0;
	}
}