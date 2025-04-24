/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from './entity-base.interface';

/**
 *  A helper class with base members for entities
 */
export abstract class EntityBase implements IEntityBase {

	/**
	 * Creation date of the entity
	 */
	public InsertedAt?: Date;

	/**
	 * User id of the creator
	 */
	public InsertedBy?: number;

	/**
	 * Date stating the last update of the entity
	 */
	public UpdatedAt?: Date;

	/**
	 *  User id of the last entity update
	 */
	public UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	public Version?: number;
}
