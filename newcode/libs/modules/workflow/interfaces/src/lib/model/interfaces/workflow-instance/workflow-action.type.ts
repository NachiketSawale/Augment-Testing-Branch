import { IWorkflowActionBase } from './interfaces/workflow-action.interface';
import { IActionParam } from './interfaces/workflow-action-param.interface';

export type WorkflowAction = IWorkflowActionBase & {
	Context: string | object;
	Input: string | IActionParam;
	Output: string | IActionParam;
	Clerk: {
		Code: string;
		Description: string;
	}
}