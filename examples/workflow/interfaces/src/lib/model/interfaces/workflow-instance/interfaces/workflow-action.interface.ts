/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowTransition } from './workflow-designer-transition.interface';
import { WorkflowActionType } from '../enums/workflow-action-type.enum';
import { IActionParam } from './workflow-action-param.interface';
import { WorkflowClientAction } from '../enums/workflow-client-action.enum';

/**
 * Base properties that will always be available in IWorkflowAction type.
 */
export interface IWorkflowActionBase {
	actionId: string | null | WorkflowClientAction;
	actionTypeId: WorkflowActionType;
	action?: string;
	actionType?: string;
	code: string;
	description: string;
	documentList: unknown[] | null;
	id: number;
	input: IActionParam[];
	lifetime: number;
	output: IActionParam[];
	transitions: IWorkflowTransition[];
	priorityId?: number;
	executeCondition: string;
}

/**
 * IWorkflowAction interface stores the JSON data of Workflow Action designer content.
 */
export type IWorkflowAction = IWorkflowActionBase & { [key: string]: string | number | undefined | IWorkflowTransition[] | IActionParam[] | unknown[] | null | object; };
