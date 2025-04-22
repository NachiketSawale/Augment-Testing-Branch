/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IMenuItem,
	ItemType
} from '../../../../index';

/**
 * A toggle menu item that belongs to a mutually exclusive group.
 *
 * @group Menu List
 */
export interface IRadioMenuItem<TContext = void> extends IMenuItem<TContext> {

	/**
	 * The value that identifies the radio option.
	 * If this is not specified, the item's ID will be used.
	 */
	value?: string | number | boolean;

	type: ItemType.Radio | undefined;
}
