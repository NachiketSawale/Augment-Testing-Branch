/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IIdentificationData } from '@libs/platform/common';

/**
 * Interface for child (sub) element data service
 * Especially for usage in cases the type information of the child service is not needed / available
 * The functionality provided is the really base set of function necessary for a child (node / leaf) data service
 */
export interface IChildRoleBase<PT extends object, PU extends CompleteIdentification<PT>> {
	/**
	 * Load entities for given identification data
	 */
	loadSubEntities(identificationData: IIdentificationData | null): Promise<void>

	clearModifications(): void

	/**
	 * Collect changed or deleted own entites belonging to the parent and ad them to the update object
	 * of the parent data service
	 * @param parentUpdate A container for all data to be saved or deleted
	 * @param parent Identifier for the parent for filtering of related subordinated entities
	 */
	collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void

	/**
	 * Writes back the updated subordinated entities sent back from the application server.
	 * @param updated Element taking the updated elements sent back from server
	 */
	takeOverUpdated(updated: PU): void

	/**
	 * Checks if there are modified entities registered for updated belonging to the passed parent
	 * @param parent
	 */
	hasModifiedFor(parent: PT): boolean
}


