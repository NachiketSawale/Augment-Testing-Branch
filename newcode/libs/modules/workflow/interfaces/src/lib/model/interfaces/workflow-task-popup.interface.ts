/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ITaskList } from './workflow-task/task-list.interface';

/**
 * Initiates workflow action from the sidebar.
 */
export interface IWorkflowTaskPopupInterface {
	/**
	 * Opens a popup and executes the related workflow action from the sidebar.
	 */
	openPopup(action: ITaskList): void;
}

/**
 * Lazy injection token for task popup service.
 */
export const WORKFLOW_TASK_POPUP_SERVICE = new LazyInjectionToken<IWorkflowTaskPopupInterface>('workflow-task-popup-service');