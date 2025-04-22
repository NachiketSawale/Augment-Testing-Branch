/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IMenuItem,
	ItemType
} from '../../../../index';

/**
 * A simple menu item that issues a command once clicked.
 *
 * @group Menu List
 */
export interface ISimpleMenuItem<TContext = void> extends IMenuItem<TContext> {

	/**
	 * The type of the menu item.
	 * If this is not specified, {@link ItemType.Item} is assumed.
	 */
	type?: ItemType.Item;
}
