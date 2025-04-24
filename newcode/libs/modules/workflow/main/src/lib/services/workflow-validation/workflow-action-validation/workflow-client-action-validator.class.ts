/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from '@libs/workflow/interfaces';
import { WorkflowActionType } from '@libs/workflow/interfaces';
import { ITemplateValidationResult } from '../../../model/interfaces/template-validation-result.interface';
import { WorkflowClientActions } from '../../../constants/workflow-client-action.class';
import { ActionValidationResult } from '../../../model/classes/action-validation-result.class';
import { PlatformTranslateService } from '@libs/platform/common';
import { ActionIdValidator } from './action-id-validator.class';
import { MissingActionValidator } from './missing-action-validator.class';
import { Type } from '@angular/core';
import { ActionTypeValidator } from './action-type-validator.class';
import { ActionParameterValidator } from './action-parameter-validator.class';
import { ObsoleteActionValidator } from './obsolete-action-validator.class';
import { IClientActionValidator } from '../../../model/interfaces/action-validator.interface';

/**
 * Validations for client actions
 */
export class WorkflowClientActionValidator {

	private clientActions;
	private clientActionValidatorList: Type<IClientActionValidator>[] = [ActionIdValidator, ObsoleteActionValidator, MissingActionValidator, ActionTypeValidator, ActionParameterValidator];
	public constructor(private validatedActionIds: number[], private translateService: PlatformTranslateService) {
		this.clientActions = new WorkflowClientActions();
	}

	private validateClientAction(workflowAction: IWorkflowAction): ActionValidationResult {
		const isStartOrEndAction = this.isStartOrEnd(workflowAction);
		if (isStartOrEndAction || (workflowAction.actionId && this.validatedActionIds.includes(workflowAction.id))) {
			throw {};
		}

		const actionValidationResult: ActionValidationResult = new ActionValidationResult();
		actionValidationResult.ActionDescription = workflowAction.description;
		this.clientActionValidatorList.forEach((clientActionValidator: Type<IClientActionValidator>) => {
			const validator = new clientActionValidator(actionValidationResult, this.translateService, this.clientActions, workflowAction);
			validator.validate();
		});
		return actionValidationResult;
	}

	private isStartOrEnd(workflowAction: IWorkflowAction): boolean {
		return workflowAction.actionTypeId === WorkflowActionType.Start || workflowAction.actionTypeId === WorkflowActionType.End;
	}

	private validationResult: ITemplateValidationResult = {};
	public validateClientActions(workflowActions: IWorkflowAction | string): ITemplateValidationResult | undefined {

		if (!workflowActions) {
			return;
		}

		if (typeof (workflowActions) === 'string') {
			workflowActions = JSON.parse((workflowActions as string)) as IWorkflowAction;
		}

		const transitions = workflowActions.transitions;
		if (!transitions) {
			return;
		}

		transitions.forEach((transition) => {
			try {
				this.validationResult[transition.workflowAction.id] = this.validateClientAction(transition.workflowAction);
			} catch (error) {
				if (typeof (error) === 'object' && Object.keys(error as object) && Object.keys(error as object).length > 0) {
					this.validationResult[transition.workflowAction.id] = error as ActionValidationResult;
				}
			} finally {
				this.validateClientActions(transition.workflowAction);
			}
		});

		return this.validationResult;
	}
}