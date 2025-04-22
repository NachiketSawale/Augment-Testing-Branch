/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Status of workflow instance.
 */
export enum WorkflowInstanceStatus {
	Running = 1,
	Finished = 2,
	Escalate = 3,
	Waiting = 4,
	Failed = 5,
	Killed = 6,
	ValidationError = 7
}