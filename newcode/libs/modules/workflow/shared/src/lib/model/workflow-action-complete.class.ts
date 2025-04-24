/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IWorkflowActionDefinition } from '@libs/workflow/interfaces';

/**
 * Workflow action default properties
 */
export class WorkflowActionComplete implements CompleteIdentification<IWorkflowActionDefinition> {
	public MainItem!: IWorkflowActionDefinition;

	public constructor(workflowAction :IWorkflowActionDefinition | undefined){
		if(workflowAction){
			this.MainItem = workflowAction;
		}
	}
}
