/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog } from '../../base/index';

/**
 * Provides access to an active list selection dialog.
 *
 * @typeParam TItem The item type shown in the lists.
 *
 * @group Dialogs
 */
export interface IListSelectionDialog<TItem extends object> extends IEditorDialog<TItem[]> {

	/**
	 * A (possibly nested) array of all available items.
	 */
	allItems: TItem[];
}
