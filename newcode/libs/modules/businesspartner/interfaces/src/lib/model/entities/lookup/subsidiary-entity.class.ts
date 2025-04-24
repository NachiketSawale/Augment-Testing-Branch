/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';


/**
 * @deprecated will be removed later, use the new {@link ISubsidiaryLookupEntity} in businesspartner\interfaces instead.
 */
export class SubsidiaryEntity implements IEntityBase {

	public Address?: string;

	public AddressLine ?: string;

	public AddressTypeInfo ?: IDescriptionInfo;

	public SubsidiaryDescription ?: string;

	public Street?: string;

	public ZipCode?: string;

	public City?: string;

	public Iso2?: string;

	public Email?: string;

	public County?: string;

	public TelephonePattern?: string;

	public TelephoneNumber1?: string;

	public TelefaxPattern?: string;

	public Telefax?: string;

	public DisplayText?: string;

	public AddressInfo?: string;

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
	 * @param BusinessPartnerFk
	 * @param SubsidiaryStatusFk
	 * @param IsMainAddress
	 */
	public constructor(
		public Id: number,
		public BusinessPartnerFk: number,
		public SubsidiaryStatusFk: number,
		public IsMainAddress: boolean
	) {

	}
}