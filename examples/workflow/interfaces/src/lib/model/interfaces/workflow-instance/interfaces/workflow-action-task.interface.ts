/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowActionDefinition } from './workflow-action-definition.interface';
import { IWorkflowActionBase } from './workflow-action.interface';


/**
 * Workflow action properties used to execute a task.
 */
export interface IWorkflowActionTask extends IWorkflowActionBase {
	Context: string | object;
	Comment: string;
	Title: string;
	SubTitle: string;
	Description: string;
	Action?: IWorkflowActionDefinition;
	Status: number;
	StatusName: string;
	Result: string;
	WorkflowInstanceId?: number;
}