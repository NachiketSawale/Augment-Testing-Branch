/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';
import { ISelectItemsSource } from './select-items-source.model';

/**
 * Declares additional options that are specific to select controls.
 *
 * @group Fields API
 */
export interface IAdditionalSelectOptions<TKey extends PropertyType = PropertyType> {
	/**
	 * Specifies the source for the items.
	 */
	itemsSource: ISelectItemsSource<TKey>;
}
