/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * An interface for objects that can modify the list of items in a master-detail dialog.
 *
 * @typeParam TValue The type edited in the master-detail dialog box.
 *
 * @group Dialogs
 */
export interface IMasterDetailEditingController<TValue extends object> {

	/**
	 * Adds a new item to the list of items.
	 *
	 * @param items The list of items.

	 * @returns The newly added item, or a promise that resolves to the newly added item.
	 */
	add(items: TValue[]): TValue | Promise<TValue>;

	/**
	 * Removes an item from the list.
	 *
	 * @param items The list of items.
	 * @param item The item to remove.
	 *
	 * @returns A value that indicates whether the operation was successful, or a promise
	 *   that resolves to such a value.
	 */
	delete(items: TValue[], item: TValue): boolean | Promise<boolean>;

	/**
	 * Checks whether a given item can be deleted.
	 * If this is not set, but {@link delete} is, all items can be deleted.
	 *
	 * @param items The list of items.
	 * @param item The item to remove.
	 *
	 * @returns A value that indicates whether the item can be removed.
	 */
	canDelete?(items: readonly TValue[], item: TValue): boolean;

	/**
	 * A custom label for the *Add* option.
	 */
	readonly addText?: Translatable;

	/**
	 * A custom label for the *Delete* option.
	 */
	readonly deleteText?: Translatable;
}
