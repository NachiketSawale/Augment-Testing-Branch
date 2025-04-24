/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Represents a subsidiary status object.
 */
export class SubsidiaryStatusEntity implements IEntityBase {
	/**
	 *
	 */
	public DescriptionInfo?: IDescriptionInfo;

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

	/**
	 *
	 * @param Id
	 * @param Code
	 * @param Sorting
	 * @param Icon
	 * @param IsLive
	 * @param IsDefault
	 * @param IsActive
	 */
	public constructor(
		public Id: number,
		public Code: string,
		public Sorting: number,
		public Icon: number,
		public IsLive: boolean,
		public IsDefault: boolean,
		public IsActive: boolean
	) {

	}
}