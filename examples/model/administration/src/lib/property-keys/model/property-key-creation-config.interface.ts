/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Provides configuration options for creating a model property key.
 */
export interface IPropertyKeyCreationConfig {

	/**
	 * Specifies whether the creation of the property key was triggered from within the `model.administration` module.
	 */
	readonly fromAdminModule?: boolean;

	/**
	 * An optional list of pre-selected tag IDs.
	 */
	readonly selectedTags?: number[];
}