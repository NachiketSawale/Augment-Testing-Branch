/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * This enumb provides all the workflow action types.
 */
export enum WorkflowActionType {
	Start = 1,
	End = 2,
	Decision = 3,
	Object = 4,
	Script = 5,
	User = 6,
	External = 7,
	Message = 8,
	Form = 9,
	Workflow = 10
}