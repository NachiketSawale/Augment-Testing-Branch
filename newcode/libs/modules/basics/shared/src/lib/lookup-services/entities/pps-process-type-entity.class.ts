/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

/**
 * Prcincoterm entity
 */
export class PpsProcessTypeEntity implements IEntityBase{
	/**
	 * constructor
	 * @param Id
	 * @param Sorting
	 * @param IsDefault
	 * @param IsLive
	 */
	public constructor(
		public Id: number,
		public Sorting: number,
		public IsDefault: boolean,
		public IsLive: boolean, 
	) {
	}

	/**
	 * description info
	 */
	public DescriptionInfo!: IDescriptionInfo;

	/**
	 * RubricCategoryFk
	 */
	public RubricCategoryFk!: number;

	/**
	 * IsPlaceHolder
	 */
	public IsPlaceHolder!: boolean;

	/**
	 * UserFlag1
	 */
	public UserFlag1!: boolean;

	/**
	 * UserFlag2
	 */
	public UserFlag2!: boolean;

	/**
	 * Creation date of the entity
	 */
	public readonly InsertedAt?: Date;

	/**
	 * User id of the creator
	 */
	public readonly InsertedBy?: number;

	/**
	 * Date stating the last update of the entity
	 */
	public readonly UpdatedAt?: Date;

	/**
	 *  User id of the last entity update
	 */
	public readonly UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	public readonly Version?: number;
}