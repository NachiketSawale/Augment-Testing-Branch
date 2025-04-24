/*
 * Copyright(c) RIB Software GmbH
 */


import { WorkflowActionType } from '@libs/workflow/interfaces';
import { IDesignerActionIcon } from '../model/workflow-designer-action-icon.interface';

/**
 * A common class containing information of workflow actions and action icons.
 */
export class WorkflowDesignerActions {
	/**
	 * Mapping of WorkflowActionType to their respective icon information.
	 * This object provides icon details for different action types used in the workflow.
	 */
	public actionTypeArray: { [key in WorkflowActionType]: IDesignerActionIcon } = {
		[WorkflowActionType.Start]: {
			id: WorkflowActionType.Start,
			description: 'Start',
			svgSprite: '',
			svgImage: '',
			tooltipActionIcon: '',
			tooltipActionIconId: '',
			svgWarningIcon: '',
			svgErrorIcon: ''
		},

		[WorkflowActionType.End]: {
			id: WorkflowActionType.End,
			description: 'End',
			svgSprite: '',
			svgImage: '',
			tooltipActionIcon: '',
			tooltipActionIconId: '',
			svgWarningIcon: '',
			svgErrorIcon: ''
		},

		[WorkflowActionType.Decision]: {
			id: WorkflowActionType.Decision,
			description: 'Decision',
			svgSprite: '',
			svgImage: '',
			tooltipActionIcon: 'tlb-icons ico-decision',
			tooltipActionIconId: 'decision',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.Object]: {
			id: WorkflowActionType.Object,
			description: 'Object Action',
			svgSprite: 'control-icons',
			svgImage: 'ico-object',
			tooltipActionIcon: 'tlb-icons ico-object',
			tooltipActionIconId: 'object',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.Script]: {
			id: WorkflowActionType.Script,
			description: 'Script Action',
			svgSprite: 'control-icons',
			svgImage: 'ico-script',
			tooltipActionIcon: 'tlb-icons ico-script',
			tooltipActionIconId: 'externalFunction',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.User]: {
			id: WorkflowActionType.User,
			description: 'User Task',
			svgSprite: 'control-icons',
			svgImage: 'ico-user-task',
			tooltipActionIcon: 'tlb-icons ico-user-task',
			tooltipActionIconId: 'sendmessage',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.External]: {
			id: WorkflowActionType.External,
			description: 'External Function',
			svgSprite: 'control-icons',
			svgImage: 'ico-external-function',
			tooltipActionIcon: 'tlb-icons ico-external-function',
			tooltipActionIconId: 'externalFunction',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.Message]: {
			id: WorkflowActionType.Message,
			description: 'Message',
			svgSprite: 'control-icons',
			svgImage: 'ico-message',
			tooltipActionIcon: 'tlb-icons ico-message',
			tooltipActionIconId: 'sendmessage',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.Form]: {
			id: WorkflowActionType.Form,
			description: 'User Form',
			svgSprite: 'control-icons',
			svgImage: 'ico-user-form',
			tooltipActionIcon: 'tlb-icons ico-user-form',
			tooltipActionIconId: 'userform',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		},

		[WorkflowActionType.Workflow]: {
			id: WorkflowActionType.Workflow,
			description: 'Workflow',
			svgSprite: 'control-icons',
			svgImage: 'ico-workflow',
			tooltipActionIcon: 'tlb-icons ico-workflow',
			tooltipActionIconId: 'workflowaction',
			svgWarningIcon: 'ico-warning-level-attention',
			svgErrorIcon: 'ico-warning-level-danger'
		}
	};

	/**
	 *Provides icons based on actionTypeId
	 * @param actionTypeId
	 * @returns object containing icons for different actions
	 */
	public getIconsByActionType(actionTypeId: WorkflowActionType) {
		return this.actionTypeArray[actionTypeId];
	}

}
