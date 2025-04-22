/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Represents an evaluationschema object.
 */
export class EvaluationSchemaEntity implements IEntityBase {

	/**
	 * Id
	 */
	public Id!: number;

	/**
	 * Sorting
	 */
	public Sorting!: number;

	/**
	 * IsDefault
	 */
	public IsDefault!: boolean;

	/**
	 * RubricCategoryFk
	 */
	public RubricCategoryFk?: number | null;

	/**
	 * EvaluationMotiveFk
	 */
	public EvaluationMotiveFk?: number | null;

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
	 * Description
	 */
	public Description?: string | null;

	/**
	 * DescriptionInfo
	 */
	public DescriptionInfo!: IDescriptionInfo;
}
