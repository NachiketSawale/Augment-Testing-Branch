/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialogOptions } from '../../base/index';
import { IGridDialog, IGridDialogState } from '..';
import { IGridDialogData } from './grid-dialog-data.interface';

/**
 * Stores options for a grid dialog.
 *
 * @typeParam TItem The item type shown in the grid.
 *
 * @group Dialogs
 */
export interface IGridDialogOptions<TItem extends object> extends IDialogOptions<IGridDialog<TItem>>, IGridDialogState<TItem>, IGridDialogData<TItem> {
}
