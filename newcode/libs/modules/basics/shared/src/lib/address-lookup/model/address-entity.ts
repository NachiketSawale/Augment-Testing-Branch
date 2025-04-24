/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Represents an address object.
 */
export class AddressEntity implements IEntityBase {
	/**
	 *
	 * @param Id Address id.
	 * @param CountryFk Country id.
	 * @param AddressModified Represents the address modified state.
	 */
	public constructor(
		public Id: number,
		public CountryFk: number,
		public AddressModified: boolean
	) {
	}

	/**
	 *
	 */
	public Street?: string;

	/**
	 *
	 */
	public ZipCode?: string;

	/**
	 *
	 */
	public City?: string;

	/**
	 *
	 */
	public County?: string;

	/**
	 *
	 */
	public StateFk?: number;

	/**
	 *
	 */
	public LanguageFk?: number;

	/**
	 *
	 */
	public Latitude?: number;

	/**
	 *
	 */
	public Longitude?: number;

	/**
	 *
	 */
	public Supplement?: string;

	/**
	 *
	 */
	public Address?: string;

	/**
	 *
	 */
	public AddressLine?: string;

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