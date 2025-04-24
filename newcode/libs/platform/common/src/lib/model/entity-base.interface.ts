/*
 * Copyright(c) RIB Software GmbH
 */

/**
 *  Interface with base members for entities
 */
export interface IEntityBase {

	/**
	 * Creation date of the entity
	 */
	readonly InsertedAt?: Date;

	/**
	 * User id of the creator
	 */
	readonly InsertedBy?: number;

	/**
	 * Date stating the last update of the entity
	 */
	readonly UpdatedAt?: Date;

	/**
	 *  User id of the last entity update
	 */
	readonly UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	readonly Version?: number;

	/**
	 * Complete content of InsertedAt and InsertedBy
	 */
	inserted?: string

	/**
	 * Complete content of UpdatedAt and UpdatedBy
	 */
	updated?: string
}
