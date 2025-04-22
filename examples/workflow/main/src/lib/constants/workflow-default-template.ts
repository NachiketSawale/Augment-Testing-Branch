import { IWorkflowAction } from '@libs/workflow/interfaces';

export const WorkflowDefaultTemplate: IWorkflowAction = {
	id: 1,
	code: '',
	description: 'Start',
	documentList: null,
	actionTypeId: 1,
	actionId: '0',
	priorityId: 1,
	executeCondition: '',
	input: [],
	lifetime: 0,
	output: [],
	transitions: [{
		id: 2,
		parameter: '',
		workflowAction: {
			id: 5,
			code: '',
			description: 'End',
			documentList: [],
			actionTypeId: 2,
			actionId: null,
			transitions: [],
			priorityId: 1,
			lifetime: 0,
			input: [],
			output: [],
			executeCondition: ''
		}
	}]
};


