/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Entity facade that contains details against all available entities in the application.
 */
export interface IDataEntityFacade {
	/**
	 * Container uuid for entity.
	 */
	ContainerUuid: string,

	/**
	 * Name of entity.
	 */
	EntityName: string,

	/**
	 * Properties of entity.
	 */
	EntityProperties: string[],

	/**
	 * UUID of the entity.
	 */
	Id: string,

	/**
	 * PKey properties used to identify the entity.
	 */
	IdPropertyNames: string[],

	/**
	 * Module of entity.
	 */
	ModuleName: string
}