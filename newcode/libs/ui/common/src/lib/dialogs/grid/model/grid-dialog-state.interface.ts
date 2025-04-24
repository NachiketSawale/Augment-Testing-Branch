/*
 * Copyright(c) RIB Software GmbH
 */

import { GridItemId } from '../../../grid/index';

/**
 * Represents the state of the data in a grid dialog.
 *
 * @typeParam TItem The item type shown in the grid.
 *
 * @group Dialogs
 */
export interface IGridDialogState<TItem extends object> {
	/**
	 * An array of items to show in the grid.
	 * If the items form a hierarchy, this array should only contain items from the root level.
	 */
	items: TItem[];

	/**
	 * The IDs of the selected items in the grid.
	 */
	selectedItems: GridItemId[];
}
