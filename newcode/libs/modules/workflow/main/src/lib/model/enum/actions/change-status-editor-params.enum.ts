/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Input/Output parameters for the action 'Mail Action'
 */
export enum ChangeStatusActionEditorParams {
	statusName = 'StatusName',
	objectId = 'ObjectId',
	newStatusId = 'NewStatusId',
	projectId = 'ProjectId',
	remark = 'Remark',
	objectPk1 = 'ObjectPk1',
	objectPk2 = 'ObjectPk2',
	checkValidate = 'CheckValidate',
	runDependentWorkflow = 'RunDependentWorkflow',
	errorMessage='ErrorMessage',
	success='Success'
}