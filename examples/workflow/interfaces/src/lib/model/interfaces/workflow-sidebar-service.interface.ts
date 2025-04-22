/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData, LazyInjectionToken } from '@libs/platform/common';
import { WorkflowTemplate } from './workflow-instance/interfaces/workflow-template.interface';
import { IAccordionItem } from '@libs/ui/common';


export enum WorkflowSidebarSwitch {
	DefaultView,
	WorkflowDetailView,
	EntityPinView
}

/**
 * Workflow sidebar service implementation.
 */
export interface IWorkflowSidebarService {
	/**
	 * Gets all available workflow templates for the current module.
	 * @returns An array of workflow templates.
	 */
	getTemplates: () => Promise<WorkflowTemplate[]>;

	/**
	 * Get list of all workflow templates
	 * @return workflowItemList
	 */
	get getWorkflowItemList(): IAccordionItem[];

	/**
	 * Set the workflow template list
	 * @param item
	 */
	setWorkflowItemList(item: IAccordionItem[]): void;

	/**
	 * Change is selected status
	 */
	setCaseForView(selectedCase: WorkflowSidebarSwitch): void;

	/**
	 * Return a boolean indicating if something is selected
	 */
	get getCaseForView(): number;

	/**
	 * Returns the id from all selected entities
	 */
	getSelectedEntityIds(): IIdentificationData[];

	/**
	 * Returns the id from all entities
	 */
	getAllEntityIds(): IIdentificationData[];

}

/**
 * Lazy injection token for workflow sidebar service.
 */
export const WORKFLOW_SIDEBAR_SERVICE = new LazyInjectionToken<IWorkflowSidebarService>('workflow-sidebar-service');