/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILocation } from './location.interface';
import { IAddressEntity } from './address-entity.interface';

/**
 * An interface that stores search options object.
 */
export interface ISearchOptions {
	/**
	 * Address.
	 */
	address: string;

	/**
	 * Entity.
	 */
	entity: IAddressEntity;

	/**
	 * SearchOnly.
	 */
	searchOnly?: boolean;

	/**
	 * Success.
	 */
	success: (location: ILocation) => void;

	/**
	 * Error.
	 */
	error?: () => void;
}
