
/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Represents an evaluationgroupicon object.
 */
export class EvaluationGroupIconEntity implements IEntityBase{

	/**
	 *
	 */
	public Id!: number;

	/**
	 *
	 */
	public EvaluationGroupFk!: number;

	/**
	 *
	 */
	public PointsFrom!: number;

	/**
	 *
	 */
	public PointsTo!: number;

	/**
	 *
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

	/**
	 *
	 */
	public CommentText?: string | null;
}
