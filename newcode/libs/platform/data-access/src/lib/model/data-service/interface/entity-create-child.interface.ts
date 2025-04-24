/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * Interface for create and management of create
 * @typeParam T - entity type handled by the data service
 */
export interface IEntityCreateChild<T> {
	/**
	 * Creates a new entity
	 * @return the new created entity
	 */
	createChild(): Promise<T>

	/**
	 * Verifies, if create is allowed. In case special verification is needed,
	 *  implement the IEntityCreateGuard<T> interface.
	 * @return true only if create is allowed
	 */
	canCreateChild(): boolean
}
