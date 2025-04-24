/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase } from '@libs/platform/common';

/**
 * Represents an evaluationschemaiconentity object.
 */
export class EvaluationSchemaIconEntity implements IEntityBase{

	/**
	 * Id
	 */
	public Id!: number;

	/**
	 * EvaluationSchemaFk
	 */
	public EvaluationSchemaFk!: number;

	/**
	 * PointsFrom
	 */
	public PointsFrom!: number;

	/**
	 * PointsTo
	 */
	public PointsTo!: number;

	/**
	 * Icon
	 */
	public Icon?: number | null;

	/**
	 * Creation date of the entity
	 */
	public InsertedAt!: Date;

	/**
	 * User id of the creator
	 */
	public InsertedBy!: number;

	/**
	 * Date stating the last update of the entity
	 */
	public UpdatedAt?: Date;

	/**
	 * User id of the last entity update
	 */
	public UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	public Version!: number;

}
