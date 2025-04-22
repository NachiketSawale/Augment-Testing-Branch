/*
 * Copyright(c) RIB Software GmbH
 */

import { IClientAction } from '@libs/workflow/shared';
import { WorkflowActionType, WorkflowClientAction } from '@libs/workflow/interfaces';
import { ReportClientActionParams } from '../model/enum/actions/report-client-action-params.enum';
import { ExtendedUserActionParams } from '../model/enum/actions/extended-user-action-params.enum';
import { WorkflowExtendedActionContainerComponent } from '../components/workflow-extended-action-container/workflow-extended-action-container.component';
import { PortalReviewBidderInvitationEmailActionEditorParams } from '../model/enum/actions/portal-review-bidder-invitation-email-action-params.enum';
import { WorkflowUserformActionComponent } from '../components/workflow-client-actions/workflow-userform-action/workflow-userform-action.component';
import { WorkflowUserInputActionComponent } from '../components/workflow-client-actions/user-input-action/user-input-action.component';



/**
 * A common class containing information of each client actions.
 */

export class WorkflowClientActions {

	private clientActions: Record<WorkflowClientAction, IClientAction<void>> = {
		[WorkflowClientAction.UserForm]: {
			Id: WorkflowClientAction.UserForm,
			Input: ['FormId', 'ContextId', 'FormDataId', 'Description', 'IsPopUp', 'Title', 'Subtitle', 'DialogConfig'],
			Output: ['FormDataId'],
			Description: 'User Form',
			ActionType: WorkflowActionType.Form,
			Namespace: 'Basics.Workflow',
			Component: WorkflowUserformActionComponent,

			//TODO : Using execute function to display user form dialog is another approach with which
			//a component implementation could be reduced. But the existing issues with display mode
			//for Dialog needs to be resolved.
			// execute: async (task: ICustomWorkflowAction) => {
			// 	const formId = task.input.find(param => param.key === 'FormId')?.value;
			// 	//formId required by IUserFormDisplayOptions is of type number.
			// 	const formIdNew = Number(formId);
			// 	const options = {
			// 		formId: formIdNew,
			// 		editable: true,
			// 		isReadonly: false,
			// 		modal: true,
			// 		displayMode: UserFormDisplayMode.Dialog
			// 	};

			// 	try {
			// 		await this.userFormService.show(options);

			// 		return Promise.resolve('Form displayed successfully');
			// 	} catch (error) {
			// 		return Promise.reject(`Failed to display form: ${error}`);
			// 	}
			// }
		},
		[WorkflowClientAction.UserInput]: {
			Id: WorkflowClientAction.UserInput,
			Input: ['Config', 'IsPopUp', 'IsNotification', 'EvaluateProxy', 'DisableRefresh', 'AllowReassign', 'EscalationDisabled', 'StopVisible', 'CancelVisible', 'Context'],
			Output: ['Context'],
			Description: 'User Input',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow',
			Component: WorkflowUserInputActionComponent
		},
		[WorkflowClientAction.Report]: {
			Id: WorkflowClientAction.Report,
			Input: [ReportClientActionParams.PreviewMode, ReportClientActionParams.ReportId, ReportClientActionParams.Parameters, ReportClientActionParams.EvaluateProxy],
			Output: [ReportClientActionParams.ReportId],
			Description: 'Report-ClientAction',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.GenericWizard]: {
			Id: WorkflowClientAction.GenericWizard,
			Input: ['GenericWizardInstanceId', 'EntityId', 'IsPopUp', 'EvaluateProxy', 'DisableRefresh', 'AllowReassign', 'Context', 'WorkflowTemplateId'],
			Output: ['Context'],
			Description: 'Generic Wizard',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.DownloadLog]: {
			Id: WorkflowClientAction.DownloadLog,
			Input: ['Context', 'IsPopUp'],
			Output: ['Result'],
			Description: 'Download AutoUpdate From Baseline Log',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.ModuleWizard]: {
			Id: WorkflowClientAction.ModuleWizard,
			Input: ['ModuleId', 'ModuleWizardInstanceId', 'WizardGuid', 'ModuleInternalName', 'Entity', 'IsPopUp', 'EvaluateProxy', 'AllowReassign', 'DisableRefresh', 'Context'],
			Output: ['Context'],
			Description: 'Module Wizard',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.Document]: {
			Id: WorkflowClientAction.Document,
			Input: ['DocumentId', 'EvaluateProxy'],
			Output: [],
			Description: 'Document-ClientAction',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.ExtendedUserInput]: {
			Id: WorkflowClientAction.ExtendedUserInput,
			Input: [ExtendedUserActionParams.Html, ExtendedUserActionParams.Script, ExtendedUserActionParams.Context, ExtendedUserActionParams.IsPopupUp, ExtendedUserActionParams.EvaluateProxy, ExtendedUserActionParams.DisableRefresh, ExtendedUserActionParams.AllowReassign, ExtendedUserActionParams.Title, ExtendedUserActionParams.Subtitle, ExtendedUserActionParams.DialogConfig],
			Output: [ExtendedUserActionParams.Context],
			Description: 'Extended User Action',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow',
			Component: WorkflowExtendedActionContainerComponent
		},
		[WorkflowClientAction.Approver]: {
			Id: WorkflowClientAction.Approver,
			Input: ['Config', 'IsPopUp', 'EvaluateProxy', 'AllowReassign', 'EscalationDisabled', 'Context'],
			Output: ['Context'],
			Description: 'Approver Action',
			ActionType: WorkflowActionType.User,
			Namespace: 'Basics.Workflow'
		},
		[WorkflowClientAction.PortalReviewBidder]: {
			Id: WorkflowClientAction.PortalReviewBidder,
			Input: [PortalReviewBidderInvitationEmailActionEditorParams.Recipient, PortalReviewBidderInvitationEmailActionEditorParams.Subject, PortalReviewBidderInvitationEmailActionEditorParams.Body, PortalReviewBidderInvitationEmailActionEditorParams.IsPopUp],
			Output: [PortalReviewBidderInvitationEmailActionEditorParams.ResultCode],
			Description: 'Portal Review Bidder Invitation Email',
			ActionType: WorkflowActionType.User,
			Namespace: 'Custom'
		}
	};

	/**
	 * This function provides the client action object based on the actionId
	 * @param clientActionId
	 * @returns
	 */
	public getClientActionById(clientActionId: WorkflowClientAction): IClientAction<void> {
		return this.clientActions[clientActionId];
	}

	/**
	 * This function provides all client action objects
	 * @returns
	 */
	public getClientActions(): Record<WorkflowClientAction, IClientAction<void>> {
		return this.clientActions;
	}


}