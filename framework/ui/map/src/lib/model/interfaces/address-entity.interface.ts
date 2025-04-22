/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores address entity object.
 */
export interface IAddressEntity {
	/**
	 * Address of place.
	 */
	Address: string;

	/**
	 * AddressLine of place.
	 */
	AddressLine: string;

	/**
	 * Address modification status.
	 */
	AddressModified: boolean;

	/**
	 * City name.
	 */
	City: string | null;

	/**
	 * Country description.
	 */
	CountryDescription: string | null;

	/**
	 * Country FK.
	 */
	CountryFk: number;

	/**
	 * Country ISO 2 code.
	 */
	CountryISO2: string | null;

	/**
	 * Country name.
	 */
	County: null | string;

	/**
	 * Address I'd.
	 */
	Id: number;

	/**
	 * Address Latitude.
	 */
	Latitude: number | null;

	/**
	 * Address Longitude.
	 */
	Longitude: number | null;

	/**
	 * State Description
	 */
	StateDescription: null;

	/**
	 * State FK.
	 */
	StateFk: number;

	/**
	 * Street.
	 */
	Street: string | null;

	/**
	 * Version.
	 */
	Version: number;

	/**
	 * Address zip code.
	 */
	ZipCode: string | null;

	/**
	 *
	 */
	waypointEntityId?: number;

	/**
	 *
	 */
	isSelected?: boolean;

	/**
	 * Message.
	 */
	message?: string;
}
