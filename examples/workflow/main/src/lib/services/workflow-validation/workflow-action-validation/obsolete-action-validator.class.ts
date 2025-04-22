/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformTranslateService } from '@libs/platform/common';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';

/**
 * Validates if action is obsolete
 */
export class ObsoleteActionValidator implements IClientActionValidator {

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
	 * Validates if action is obsolete
	 */
	public validate() {
		//TODO: Move obsolete list to a common file
		const obsoleteActionList: string[] = [];

		//Action id will never be null as the process should stop in the previous validation if so.
		if (obsoleteActionList.includes(this.workflowAction.actionId as string)) {
			this.actionValidationResult.ErrorList.push(`${this.translateService.instant('basics.workflow.workflowAction.errors.obsoleteWarning')}`);
		}
	}
}