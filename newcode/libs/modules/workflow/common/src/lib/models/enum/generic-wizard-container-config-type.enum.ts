/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Generic wizard container configuration type.
 */
export enum GenericWizardContainerConfigType {
	/**
	 * The data service is retrieved from an already defined service on the client.
	 */
	Entity,

	/**
	 * The data service is prepared from a generic configuration.
	 */
	Custom,

	/**
	 * An object of the type container definition is provided.
	 */
	ContainerDefinition
}