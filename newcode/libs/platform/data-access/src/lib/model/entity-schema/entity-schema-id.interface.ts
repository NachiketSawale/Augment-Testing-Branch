/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the ID of a server-side DTO class that stores data of an entity.
 */
export interface IEntitySchemaId {

	/**
	 * The DTO class name in PascalCase.
	 */
	readonly typeName: string;

	/**
	 * The full module name in the form `Main.Sub` in PascalCase.
	 */
	readonly moduleSubModule?: string;

	/**
	 * The name of the .NET assembly where the typeName can be found
	 */
	readonly assemblyName?: string;
}