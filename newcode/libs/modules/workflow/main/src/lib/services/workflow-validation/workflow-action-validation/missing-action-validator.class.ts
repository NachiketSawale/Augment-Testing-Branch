/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformTranslateService } from '@libs/platform/common';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { WorkflowClientAction, IWorkflowAction } from '@libs/workflow/interfaces';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';

/**
 * Validates if the current action has been removed
 */
export class MissingActionValidator implements IClientActionValidator {

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
	 * Validates if the current action has been removed
	 */
	public validate() {
		if (!this.getClientAction()) {
			this.actionValidationResult.IsActionMissing = true;
			this.actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionNotAvailable').text}`);
			throw this.actionValidationResult;
		}
	}
}