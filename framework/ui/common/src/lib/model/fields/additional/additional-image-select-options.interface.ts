/*
 * Copyright(c) RIB Software GmbH
 */

import { IFixedSelectOptions } from './fixed-select-options.interface';
import { IServiceSelectOptions } from './service-select-options.interface';

/**
 * Declares additional options that are specific to select controls.
 */

export interface IAdditionalImageSelectOptions {

	/**
	 * Specifies the source for the items.
	 */
	itemsSource: IFixedSelectOptions | IServiceSelectOptions;
}
