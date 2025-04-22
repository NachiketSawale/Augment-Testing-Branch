/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ISelectOptions} from './select-options.interface';

/**
 * Represents the configuration for a *select* control whose data is provided as an array.
 *
 * @group Fields API
 */
export interface IFixedSelectOptions extends ISelectOptions {

	/**
	 * The eligible items.
	 */
	items: object[];
}