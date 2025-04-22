/*
 * Copyright(c) RIB Software GmbH
 */




import { DebugContext, IWorkflowActionTask } from '@libs/workflow/interfaces';
import { IClientAction } from './workflow-client-action.interface';


/**
 * A custom Workflow action interface that stores additional data like component name , options etc properties
 *  necessary useful for workflow client-actions.
 */
export interface ICustomWorkflowAction extends IWorkflowActionTask {
	options?: { id: string | null; parameter: string | null }[];
	clientActionInfo?: IClientAction<void>;
	context?: string | DebugContext;
}
