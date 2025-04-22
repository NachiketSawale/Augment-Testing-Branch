/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Represents an evaluationgroup object.
 */
export class EvaluationGroupEntity implements IEntityBase{
	/**
	 *
	 */
	public Id!: number;

	/**
	 *
	 */
	public EvaluationSchemaFk!: number;

	/**
	 *
	 */
	public DescriptionInfo!: IDescriptionInfo;

	/**
	 *
	 */
	public Sorting!: number;

	/**
	 *
	 */
	public CommentText!: string | null;

	/**
	 *
	 */
	public Weighting!: number;

	/**
	 *
	 */
	public IsOptional!: boolean;

	/**
	 *
	 */
	public IsDefault!: boolean;

	/**
	 * Creation date of the entity
	 */
	public readonly InsertedAt!: Date;

	/**
	 * User id of the creator
	 */
	public readonly InsertedBy!: number;

	/**
	 * Date stating the last update of the entity
	 */
	public readonly UpdatedAt?: Date;

	/**
	 * User id of the last entity update
	 */
	public readonly UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	public readonly Version!: number;
}
