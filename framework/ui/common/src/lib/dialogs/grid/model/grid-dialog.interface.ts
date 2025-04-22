/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridApi } from '../../../grid';
import { IDialog } from '../../base/index';
import { IGridDialogState } from './grid-dialog-state.interface';

/**
 * Provides access to an active grid dialog.
 *
 * @typeParam TItem The item type shown in the grid.
 *
 * @group Dialogs
 */
export interface IGridDialog<TItem extends object> extends IDialog, IGridDialogState<TItem> {
	/**
	 * Reference to grid.
	 */
	readonly gridRef: IGridApi<TItem>;
}
