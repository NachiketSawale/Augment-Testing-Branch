/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Properties required to continue the workflow.
 */
export type WorkflowContinueActionInstance = {
	/**
	 * Action instance Id
	 */
	Id: number;

	/**
	 * Action instance output
	 */
	Output: string;
	/**
	 * Action instance context
	 */
	Context: string | object;

	/**
	 * Action instance result
	 */
	Result: string;

	/**
	 * Id of the action denoting the type of user action it is.
	 */
	ActionId: string;

	/**
	 * Id of the workflow instance that the action instance has been created for.
	 */
	WorkflowInstanceId: number;
}