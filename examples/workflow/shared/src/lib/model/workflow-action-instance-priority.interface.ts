/*
 * Copyright(c) RIB Software GmbH
 */

export interface IWorkflowActionInstancePriority {
	Id: number,
	Code: string,
	Description: string,
	DescriptionTr?: number,
	Icon: number,
	IsDefault: boolean,
	Sorting: number
}