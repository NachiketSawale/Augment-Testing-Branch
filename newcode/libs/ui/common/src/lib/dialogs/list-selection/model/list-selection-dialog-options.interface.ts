/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialogOptions } from '../../base/index';
import { IListSelectionDialog } from './list-selection-dialog.interface';
import { IListSelectionDialogBodyData } from './list-selection-dialog-body-data.interface';

/**
 * Stores options for a list selection dialog.
 *
 * @typeParam TItem The item type shown in the lists.
 *
 * @group Dialogs
 */
export interface IListSelectionDialogOptions<TItem extends object> extends IListSelectionDialogBodyData<TItem>, IEditorDialogOptions<TItem[], IListSelectionDialog<TItem>> {}
