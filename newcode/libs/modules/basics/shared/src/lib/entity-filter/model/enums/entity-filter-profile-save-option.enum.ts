/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum representing the options for saving an entity filter profile.
 */
export enum EntityFilterProfileSaveOption {
	/**
	 * Save the profile as a change to an existing profile.
	 */
	AsChange = 1,

	/**
	 * Save the profile as a profile copy.
	 */
	AsCopy = 2,
}
