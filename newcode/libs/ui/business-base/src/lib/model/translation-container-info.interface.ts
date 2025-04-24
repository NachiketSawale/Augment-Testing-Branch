/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Stores information about a translation container.
 */
export interface ITranslationContainerInfo {

	/**
	 * The container UUID.
	 */
	readonly uuid: string;

	/**
	 * Optionally, a permission UUID for the container.
	 */
	readonly permissionUuid?: string;
}
