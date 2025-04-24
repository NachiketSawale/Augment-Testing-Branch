/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

/**
 * Interface for child (sub) element data service
 * Especially for usage in cases the type information of the child service is not needed / available
 * The functionality provided is the really base set of function necessary for a child (node / leaf) data service
 */
export interface IEntityUpdateAccessor<T extends object, U extends CompleteIdentification<T>> {
	/**
	 *
	 */
	get itemName(): string

	/**
	 *
	 * @param modified
	 */
	createUpdateEntity(modified: T | null): U

	/**
	 * Get the modified entities from complete entity after updated is done
	 * @param complete
	 */
	getModificationsFromUpdate(complete: U): T[]
}


