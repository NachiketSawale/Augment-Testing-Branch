/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformTranslateService } from '@libs/platform/common';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';
import { WorkflowClientAction } from '@libs/workflow/interfaces';

/**
 * Validates if action type is proper
 */
export class ActionTypeValidator implements IClientActionValidator {

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
	 * Validates if action type is proper
	 */
	public validate() {
		if (this.workflowAction.actionTypeId === this.getClientAction().ActionType) {
			this.workflowAction.actionTypeId = this.getClientAction().ActionType;
			this.actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionIdMissing').text}`);
		}
	}
}