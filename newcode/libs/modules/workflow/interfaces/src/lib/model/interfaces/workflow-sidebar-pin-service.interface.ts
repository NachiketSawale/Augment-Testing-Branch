/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { IWorkflowSidebarPin } from './workflow-sidebar-pin.interface';
import { IDataEntityFacade } from './data-entity-facade.interface';

export interface IWorkflowSidebarPinService {

	/**
	 * Creates a new sidebar list or push it into the existing list
	 * @param pin
	 */
	createPin(pin: IWorkflowSidebarPin): void;

	/**
	 * Safes the selected pin into the local storage
	 * @param pin
	 */
	safePinIntoLocalStorage(pin: IWorkflowSidebarPin): void;

	/**
	 * Get all saved pinned entities from the local storage
	 */
	getPinnedEntitiesFromStorage(): IWorkflowSidebarPin[];

	/**
	 * Get a pinned entity by id
	 * @param id The id of the saved entity
	 */
	getPinnedEntityById(id: number): IWorkflowSidebarPin | undefined

	/**
	 * Delete pinned item by id
	 * @param id
	 */
	deletePinById(id: number): void

	/**
	 * checks if a module and an entity is selected
	 */
	isCreateDisabled(selectedEntityFacade: IDataEntityFacade): boolean
}

/**
 * Lazy injection token for workflow sidebar pin service.
 */
export const WORKFLOW_SIDEBAR_PIN_SERVICE = new LazyInjectionToken<IWorkflowSidebarPinService>('workflow-sidebar-pin-service');