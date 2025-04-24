/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IMenuItem,
	IMenuItemsList,
} from '../../../../index';

/**
 * Contains the common properties for all menu items that contain sub-items.
 *
 * @group Menu List
 */
export interface IParentMenuItem<TContext = void> extends IMenuItem<TContext> {

	/**
	 * The items contained in the sublist.
	 */
	list: IMenuItemsList<TContext>;
}
