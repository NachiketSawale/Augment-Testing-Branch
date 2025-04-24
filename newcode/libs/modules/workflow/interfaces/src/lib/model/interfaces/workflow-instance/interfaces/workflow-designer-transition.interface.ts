/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowAction } from './workflow-action.interface';

/**
 * IWorkflowTransition stores the details of Transition array parameter of each node in Workflow Action Designer content.
 */
export interface IWorkflowTransition {
	id: number;
	parameter: string;
	workflowAction: IWorkflowAction;
}