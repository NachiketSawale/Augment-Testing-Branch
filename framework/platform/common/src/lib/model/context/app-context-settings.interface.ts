/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface used for storing application context values in local storage.
 * @type T A generic type which will be saved in local storage.
 */
export interface IApplicationContextSettings<T> {

	/**
	 * Holds persist status.
	 */
	readonly persist: boolean;

	/**
	 * Holds sidebar user settings value.
	 */
	readonly val: T | null;
}