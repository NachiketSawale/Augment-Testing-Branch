/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 *
 */
export class TelephoneEntity implements IEntityBase {
	/**
	 *
	 * @param Id
	 */
	public constructor(public Id: number) {

	}

	/**
	 * The country id
	 */
	public CountryFk?: number;

	/**
	 * Area code
	 */
	public AreaCode?: string;

	/**
	 * Comment
	 */
	public CommentText?: string;

	/**
	 * Extention
	 */
	public Extention?: string;

	/**
	 * Phone number
	 */
	public PhoneNumber?: string;

	/**
	 * Telephone
	 */
	public Telephone?: string;

	/**
	 * Pattern
	 */
	public Pattern?: string;

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
