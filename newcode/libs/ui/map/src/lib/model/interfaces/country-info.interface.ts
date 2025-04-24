/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores country info object.
 */
export interface ICountryInfo {
	/**
	 * AreaCode.
	 */
	AreaCode?: string;

	/**
	 * Country Iso2.
	 */
	Iso2?: string;

	/**
	 * Recordstate.
	 */
	Recordstate?: boolean;

	/**
	 * Country Id.
	 */
	Id: number;

	/**
	 * Description.
	 */
	Description?: string;
}
