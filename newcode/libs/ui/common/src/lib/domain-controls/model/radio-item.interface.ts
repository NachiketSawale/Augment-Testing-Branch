/**
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Radio item information.
 */
export interface IRadioItem {
	/**
	 * Radio item id.
	 */
	id: string | number | boolean;

	/**
	 * Radio item displayName.
	 */
	displayName: Translatable;

	/**
	 * Radio item iconCSS class.
	 */
	iconCSS?:string;
}
