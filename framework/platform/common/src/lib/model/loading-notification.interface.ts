/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * structure of the loading phase notification
 */
export interface ILoadingNotification {

	/**
	 * Flag stating whether the target is a module or not
	 */
	isModule: boolean;

	/**
	 * The module from where the navigation started
	 */
	sourceModuleInternalName?: string;

	/**
	 * The navigation target module name
	 */
	destinationModuleInternalName?: string;

	/**
	 * The non module page path from where the navigation started
	 */
	sourceNonModulePagePath?: string;

	/**
	 * The navigation target non-module page path
	 */
	destinationNonModulePagePath?: string;
}