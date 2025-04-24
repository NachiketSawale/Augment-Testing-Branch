/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for create and management of create
 * @typeParam T - entity type handled by the data service
 */

export interface IEntityCreate<T> {
	/**
	 * Creates a new entity
	 * @return the new created entity
	 */
	create(): Promise<T>

	/**
	 * Verifies, if create is allowed. In case special verification is needed,
	 *  implement the IEntityCreateGuard<T> interface.
	 * @return true only if create is allowed
	 */
	canCreate(): boolean

	/**
	 * Verifies, if create is supported.
	 * @return true only if create is supported
	 */
	supportsCreate(): boolean

	/**
	 * Verifies, if create dynamic dialog is supported.
	 * @return true only if dynamic create dialog is supported
	 */
	supportDynamicCreate?(): boolean
}
