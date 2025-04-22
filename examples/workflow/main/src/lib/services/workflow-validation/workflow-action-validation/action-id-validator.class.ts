/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformTranslateService } from '@libs/platform/common';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';

/**
 * Validates if the current action has an action id.
 */
export class ActionIdValidator implements IClientActionValidator {

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
	 * Validates if the current action has an action id.
	 */
	public validate() {
		if (this.workflowAction.actionId == undefined || this.workflowAction.actionId == null) {
			this.actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.actionTypeWrong').text}`);
			throw (this.actionValidationResult);
		}
	}
}