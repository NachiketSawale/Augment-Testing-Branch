/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the commands offered by the navigation bar.
 */
export interface INavigationBarControls {

	/**
	 * Saves the changes made in the UI, updating the corresponding data
	 * @return a Promise to save data received from the application server
	 */
	save(): Promise<void>;

	/**
	 * Refreshes the selected root entity along with all its associated children entities
	 * @return a Promise that represents the refresh operation for the selected root entity and its children
	 */
	refreshSelected(): Promise<void>;

	/**
	 * Performs a comprehensive refresh, updating all entities within the current module
	 * @return a Promise that represents the comprehensive refresh operation for all entities
	 */
	refreshAll(): Promise<void>;

	/**
	 * Navigates to the previous root entity
	 * @return a Promise that represents the navigation to the previous root entity
	 */
	goToPrevious(): Promise<void>;

	/**
	 * Navigates to the next root entity
	 * @return a Promise that represents the navigation to the next root entity
	 */
	goToNext(): Promise<void>;

	/**
	 * Navigates to the first root entity
	 * @return a Promise that represents the navigation to the first root entity
	 */
	goToFirst(): Promise<void>;

	/**
	 * Navigates to the last root entity
	 * @return a Promise that represents the navigation to the last root entity
	 */
	goToLast(): Promise<void>;
}
