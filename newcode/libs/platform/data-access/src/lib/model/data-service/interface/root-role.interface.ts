/*
 * Copyright(c) RIB Software GmbH
 */

import { IParentRole } from './parent-role.interface';
import { CompleteIdentification, ISearchResult } from '@libs/platform/common';
import { ISearchPayload } from '@libs/platform/common';
import { IRootRoleBase } from './root-role-base.interface';

/**
 * Interface for root data services. For instance functions are provided for the usage in navigation toolbar and sidebar.
 * @typeParam T -  entity type handled by the data service
 * @typeParam U -  complete entity for update of own entities and subordinated entities
 */
export interface IRootRole<T extends object, U extends CompleteIdentification<T>> extends IRootRoleBase, IParentRole<T, U> {
	/**
	 * Called from the sidebar to reload the data filtered by the input given from the user in the sidebar
	 * @param payload
	 * @returns An observalble to ISearchResult<T> for indication that the load process is finished
	 */
	filter(payload: ISearchPayload): Promise<ISearchResult<T>>

	/**
	 * Called from the sidebar to reload the data filtered by the input given from the user in the sidebar
	 * @param payload
	 * @param onSuccess
	 */
	filterEnhanced?<PT extends object, RT>(payload: PT, onSuccess: (loaded: RT) => ISearchResult<T>): Promise<ISearchResult<T>>

	/**
	 * Called from the toolbar to reload the data selected by user in the root container
	 * @param payload
	 */
	refreshSelectedEntities(payload: ISearchPayload): Promise<T[]>

	/**
	 * Called from the toolbar to reload the data selected by user in the root container
	 * @param payload
	 * @param onSuccess
	 */
	refreshSelectedEnhanced?<PT extends object, RT>(payload: PT, onSuccess: (loaded: RT) => ISearchResult<T>): Promise<T[]>

	/**
	 * Implementation of the update button of the navigation bar.
	 * @returns An observable to the update data send back from application server
	 */
	update(oldSelection: T): Promise<T>

	/**
	 * Refresh selected
	 * @param selected
	 */
	refreshOnlySelected(selected: T[]): Promise<T[]>

	/**
	 * Refresh all entities being loaded currently
	 */
	refreshAllLoaded(): Promise<T[]>

}

