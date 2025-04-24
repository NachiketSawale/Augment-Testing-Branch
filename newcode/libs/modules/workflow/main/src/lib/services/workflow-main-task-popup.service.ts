/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ClientActionService } from './client-action.service';
import { WorkflowInstanceService } from './workflow-instance/workflow-instance.service';
import { LazyInjectable } from '@libs/platform/common';
import { IActionParam, IWorkflowActionTask, IWorkflowTaskPopupInterface, IWorkflowTransition, WORKFLOW_TASK_POPUP_SERVICE, WorkflowActionType, WorkflowContinueActionInstance, ITaskList } from '@libs/workflow/interfaces';
import { StandardDialogButtonId } from '@libs/ui/common';
import { WorkflowMainTaskService } from './workflow-main-sidebar-task.service';
import { replace } from 'lodash';

/**
 * Handles the user action tasks in workflow.
 */
@LazyInjectable({
	token: WORKFLOW_TASK_POPUP_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class WorkflowMainTaskPopupService implements IWorkflowTaskPopupInterface {

	//TODO: Initialize interval to check for isPopup tasks
	//TODO: Add function to instantly open tasks with isPopup true

	private readonly workflowClientActionService = inject(ClientActionService);
	private readonly workflowInstanceService = inject(WorkflowInstanceService);
	private readonly worklflowTaskService = inject(WorkflowMainTaskService);

	/**
	 * Opens the popup from the sidebar and displays the required items.
	 * @param action current selected action.
	 */
	public async openPopup(action: ITaskList) {
		const workflowAction: IWorkflowActionTask = {
			...action,
			input: action.Input as unknown as IActionParam[],
			output: action.Output as unknown as IActionParam[],
			Context: action.Context,
			Title: '',
			SubTitle: '',
			StatusName: '',
			Status: action.Status,
			actionId: action.ActionId,
			actionTypeId: '' as unknown as WorkflowActionType,
			code: '',
			description: action.Description,
			documentList: [],
			id: action.Id,
			lifetime: action.Lifetime,
			transitions: action.Transitions as unknown as IWorkflowTransition[],
			executeCondition: action.ExecuteCondition
		};
		const result = await this.workflowClientActionService.prepareAndExecuteAction<{ context: { WizardResult: { close: boolean, wizardFinished: boolean }, [key: string]: object | string }, result: string }>(workflowAction);
		if (result && result.value) {
			if (result.closingButtonId !== StandardDialogButtonId.Cancel) {

				//Remove task
				this.worklflowTaskService.removeWorkflowTask(action.Id);

				const context = result.value.context;

				let actionButtonName = replace(action.Description, /\s/g, '');
				actionButtonName += 'ButtonResult';
				context[actionButtonName] = result.value.result;

				const continueWorkflowActionDto: WorkflowContinueActionInstance = {
					Id: action.Id,
					ActionId: action.ActionId,
					Context: context,
					Output: action.Output,
					Result: result.value.result,
					WorkflowInstanceId: action.WorkflowInstanceId
				};
				this.workflowInstanceService.continueWorkflow(continueWorkflowActionDto);
			}
		}
	}

}