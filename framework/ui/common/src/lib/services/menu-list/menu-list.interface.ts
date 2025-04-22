/*
 * Copyright(c) RIB Software GmbH
 */

import { InsertPosition } from '../../model/toolbar/enum/insert-position.enum';
import { ConcreteMenuItem } from '../../model/menu-list/interface/index';


/**
 * An interface to control the content of a menu list.
 *
 * @typeParam TContext An optional context object type.
 */
export interface IMenuList<TContext = void> {

	/**
	 * Adds one or more items at the end of the menu list.
	 * @param newItems The new items.
	 * @param groupId The group ID.
	 */
	addItems(newItems: ConcreteMenuItem<TContext> | ConcreteMenuItem<TContext>[], groupId?: string): void;

	/**
	 * Adds one or more items at a specified position in the menu list.
	 * @param items The new items.
	 * @param itemId The ID of the item at which the insertion should take place.
	 * @param position Indicates the position at which to insert the new items.
	 * @returns A value that indicates whether the insertion was successful.
	 */
	addItemsAtId(newItems: ConcreteMenuItem<TContext> | ConcreteMenuItem<TContext>[], itemId: string, position?: InsertPosition): boolean;

	/**
	 * Deletes items by their ID.
	 * @param itemIds The item IDs to remove.
	 * @returns A value that indicates whether all indicated IDs were deleted.
	 */
	deleteItems(itemIds: string | string[]): boolean;

	/**
	 * Removes all items from the menu list.
	 */
	clear(): void;

	/**
	 * Sets the visibility of the menu list.
	 */
	setVisibility(isVisible: boolean): void;
}
