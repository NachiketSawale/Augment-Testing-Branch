/*
 * Copyright(c) RIB Software GmbH
 */

import { IMenuItem } from './menu-item.interface';

/**
 * Provides information about an event that happens in a menu list.
 *
 * @typeParam TContext An object that represents the context in which the menulist appears.
 *
 * @group Menu List
 */
export interface IMenuItemEventInfo<TContext = void> {

	/**
	 * The context of the menu list.
	 */
	readonly context: TContext;

	/**
	 * The item from where the event was triggered.
	 */
	readonly item: IMenuItem<TContext>;

	/**
	 * Indicates if the menu item is checked.
	 * If the item is not a toggle item, this will always be `false`.
	 */
	readonly isChecked: boolean;
}
