/**
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { ITaskList } from './workflow-task/task-list.interface';
import { LazyInjectionToken } from '@libs/platform/common';
import { ITaskListLookupValue } from './workflow-task-sidebar/task-list-lookup-value.interface';
import { ITaskListFilterDefinition } from './workflow-task-sidebar/task-list-filter-header-definition.interface';
import { ITaskDialogValues } from './workflow-task-sidebar/task-dialog-values.interface';
import { ITaskListFilterDefs } from './workflow-task-sidebar/task-list-filter-definition.interface';


/**
 * Service used to handle workflow tasks in the sidebar.
 */
export interface IWorkflowSidebarTask {

	/**
	 * Loads all workflow client action tasks.
	 */
	loadWorkflowTasks(): Promise<void>;

	/**
	 * Loads the number of workflow tasks available for the current user.
	 */
	loadWorkflowTaskCount(): Promise<void>;

	/**
	 * Returns an observable stream of the current client tasks for the user.
	 */
	get WorkflowSidebarTasks$(): Observable<ITaskList[]>;

	/**
	 * Gets an observable count of client actions available for the current user.
	 * @returns
	 */
	get TaskCount$(): Observable<number>;

	/**
	 * Gets the count of client actions available for the current user.
	 * @constructor
	 */
	get TaskCount(): number;

	/**
	 * Removes the client action from the sidebar.
	 */
	removeWorkflowTask(id: number): void;

	/**
	 * Clears notification tasks from sidebar.
	 */
	clearNotifications(): void;

	/**
	 * Format date
	 * @param inputDate
	 * @param started
	 */
	formatDate(inputDate: string, started: boolean): string;

	/**
	 * Save the filter definition with dialog values
	 * @param dialogValues
	 */
	prepareSaveDefinitionAs(dialogValues: ITaskDialogValues): void;

	/**
	 * Save the filter definition
	 */
	prepareSaveFilterDefinition(): void;

	/**
	 * Returns all filter definition
	 * @constructor
	 */
	get FilterDefinitions(): ITaskListFilterDefinition[];

	/**
	 * Returns the lookup value
	 * @constructor
	 */
	get LookupValue(): ITaskListLookupValue;

	/**
	 * Returns the task list
	 */
	get TaskList(): ITaskList[];

	/**
	 *Set the task list
	 * @param taskList
	 * @constructor
	 */
	set TaskList(taskList: ITaskList[]);

	/**
	 *
	 * @param filterDef
	 */
	parseFilterDefinitions(filterDef: ITaskListFilterDefs): void;

	/**
	 * Function for the sorting lookup.
	 * Sorts and regroups the tasklist.
	 * @param ascending
	 */
	sortTaskList(ascending: boolean): void;

	/**
	 * returns the saved Filter Definitions containing the grouping and sorting values
	 */
	loadFilterDefinitions(): Promise<ITaskListFilterDefinition[]>;
}

export const WORKFLOW_TASK_SIDEBAR_TOKEN = new LazyInjectionToken<IWorkflowSidebarTask>('workflow-sidebar-task');