/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Workflow default approver instance properties
 */
export interface IWorkflowApproverInstance{
	Id: number,
	IsApproved: boolean,
	Comment: string,
	EvaluationLevel: number,
	EvaluatedOn?: Date,
	DueDate?: Date,
	ClerkRole: string,
	Clerk: string
}