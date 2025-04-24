/*
 * Copyright(c) RIB Software GmbH
 */

import { SimpleIdProperty, Translatable } from '@libs/platform/common';
import { IListSelectionDialog } from './list-selection-dialog.interface';
import { IGridConfiguration } from '../../../grid/index';

/**
 * A function that returns a boolean value for a given item in a list selection dialog.
 *
 * @typeParam TItem The item type handled in the list selection dialog.
 *
 * @group Dialogs
 */
export type ListSelectionDialogItemPredicate<TItem extends object> = (item: TItem, dialog: IListSelectionDialog<TItem>) => boolean;

/**
 * Stores options for a list selection dialog.
 *
 * @typeParam TItem The item type shown in the lists.
 *
 * @group Dialogs
 */
export interface IListSelectionDialogBodyData<TItem extends object> {
	/**
	 * Configuration options for the grid of available items in the dialog box, including the list of columns.
	 */
	availableGridConfig: Omit<IGridConfiguration<TItem>, 'items'>;

	/**
	 * A custom title for the list of available items.
	 */
	availableTitle?: Translatable;

	/**
	 * Configuration options for the grid of selected items in the dialog box, including the list of columns.
	 */
	selectedGridConfig: Omit<IGridConfiguration<TItem>, 'items'>;

	/**
	 * A custom title for the list of selected items.
	 */
	selectedTitle?: Translatable;

	/**
	 * A (possibly nested) array of all available items.
	 */
	allItems: TItem[];

	/**
	 * A function that receives an item object and returns a boolean value to indicate
	 * whether the item may be added to the list of selected items more than once.
	 * You can also assign a boolean value to generally allow or disallow the insertion
	 * of multiple instances of the same item.
	 */
	canInsertMultiple?: boolean | ListSelectionDialogItemPredicate<TItem>;

	/**
	 * A function that receives an item object and returns a boolean value to indicate
	 * whether the item should be hidden from the list of available items if all of
	 * its children are hidden. The default implementation of the function will only
	 * return `true` for unselectable items that have at least one child item in {@link allItems}.
	 */
	hideWithoutChildren?: ListSelectionDialogItemPredicate<TItem>;

	/**
	 * A function that receives an item object as an argument, and that returns a boolean
	 * value to indicate whether the item can be added to the list of selected items.
	 * If left unspecified, parent nodes in a tree of available items will be assumed to
	 * be unselectable, and all other items will be considered to be selectable.
	 */
	isSelectable?: ListSelectionDialogItemPredicate<TItem>;

	/**
	 * A function to sort an array. It has one parameter which contains the array of
	 * selected elements. If set, manual reordering of the list of selected items will
	 * be prevented, and instead the result of the function is used as array of the
	 * selected items.
	 */
	sortItems?: (items: TItem[]) => void;

	/**
	 * Entity text for Id.
	 */
	idProperty: SimpleIdProperty<TItem>;
}
