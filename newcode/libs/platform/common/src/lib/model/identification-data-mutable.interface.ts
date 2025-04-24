/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * The interface that represents a unique ID of up to four components.
 */
export interface IIdentificationDataMutable {

	/**
	 * The most specific ID.
	 */
	id: number;

	/**
	 * The second-to-most specific ID.
	 */
	pKey1?: number;

	/**
	 * The third-to-most specific ID.
	 */
	pKey2?: number;

	/**
	 * The least specific ID.
	 */
	pKey3?: number;
}
