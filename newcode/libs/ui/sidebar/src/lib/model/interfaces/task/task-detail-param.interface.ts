/*
 * Copyright(c) RIB Software GmbH
 */

import { ITaskList } from '@libs/workflow/interfaces';


/**
 * Prepares the input for task-sidebar-detail container
 */
export interface ITaskDetailParam {
	/**
	 * tasks list
	 */
	tasks: ITaskList[],
	/**
	 * selectedId
	 */
	selectedId: number | string
}
