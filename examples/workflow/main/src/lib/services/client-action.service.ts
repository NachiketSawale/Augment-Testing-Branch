/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ICustomDialogOptions, IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { IClientAction, WORKFLOW_ACTION_CONTEXT_TOKEN, WORKFLOW_ACTION_INPUT_TOKEN } from '@libs/workflow/shared';
import { DebugContext, IWorkflowActionTask, WorkflowClientAction } from '@libs/workflow/interfaces';
import { WorkflowCommonGenericWizardService } from '@libs/workflow/common';
import { WorkflowInstanceService } from './workflow-instance/workflow-instance.service';
import { WorkflowClientActions } from '../constants/workflow-client-action.class';

/**
 * A service that provides custom dialog based on client-actions.
 */
@Injectable({
	providedIn: 'root'
})
export class ClientActionService {

	private readonly modalDialogService: UiCommonDialogService = inject(UiCommonDialogService);
	private readonly workflowCommonGenericWizardService = inject(WorkflowCommonGenericWizardService);
	private readonly instanceService = inject(WorkflowInstanceService);

	public prepareAndExecuteAction<T extends object>(action: IWorkflowActionTask, clientActionInfo?: IClientAction<void>, context?: DebugContext): Promise<IEditorDialogResult<T>> | undefined {

		//TODO: refine?
		if (context !== undefined) {
			action.Context = context;
		} else {
			context = action.Context as DebugContext;
		}

		const updatedAction = this.instanceService.prepareTask(action, context);
		if (clientActionInfo === undefined) {
			clientActionInfo = new WorkflowClientActions().getClientActionById(action.actionId as WorkflowClientAction);
		}

		return this.executeAction(updatedAction, clientActionInfo);
	}

	/**
	 * executeAction function is responsible for providing modal-dialog with custom dialog-body element
	 * based on calling client-action component.
	 * @param action current debug action
	 * @param context context of current debug action.
	 */
	private executeAction<T extends object>(action: IWorkflowActionTask, clientActionInfo: IClientAction<void>): Promise<IEditorDialogResult<T>> | undefined {

		//Todo : To display user forms using execute function.
		if (clientActionInfo && clientActionInfo.Id === WorkflowClientAction.GenericWizard) {
			return this.workflowCommonGenericWizardService.execute<T>(action);
		} else if (clientActionInfo && clientActionInfo.Component) {
			const modalOptions = {
				id: 'client-action-input',
				width: '60%',
				buttons: [{ id: StandardDialogButtonId.Ok }, { id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } }]
			};

			const customDialogData: ICustomDialogOptions<T, void> = {
				...modalOptions,
				bodyComponent: clientActionInfo.Component,
				bodyProviders: [
					{ provide: WORKFLOW_ACTION_INPUT_TOKEN, useValue: action.input },
					{ provide: WORKFLOW_ACTION_CONTEXT_TOKEN, useValue: action.Context },
				],
			};

			return this.modalDialogService.show(customDialogData)?.then((result) => {

				if (result.closingButtonId === StandardDialogButtonId.Ok && action.Context) {
					const newContext = action.Context as T;
					result = { ...result, value: newContext };
				}
				return result;
			});

		}
		return undefined;
	}

}
