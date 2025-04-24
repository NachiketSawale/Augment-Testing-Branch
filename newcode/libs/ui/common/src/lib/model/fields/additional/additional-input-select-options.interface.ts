/**
 * Copyright(c) RIB Software GmbH
 */

import { IFixedSelectOptions } from './fixed-select-options.interface';
import { IInputSelectOptions } from './input-select-options.interface';
import { IServiceSelectOptions } from './service-select-options.interface';

/**
 * Declares additional options that are specific to select controls.
 *
 * @group Fields API
 */
export interface IAdditionalInputSelectOptions {
	/**
	 * Specifies the source for the items.
	 */
	options: IFixedSelectOptions | IServiceSelectOptions | IInputSelectOptions;
}
