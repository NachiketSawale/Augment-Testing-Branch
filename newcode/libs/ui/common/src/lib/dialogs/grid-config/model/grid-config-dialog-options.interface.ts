/*
 * Copyright(c) RIB Software GmbH
 */

import { SimpleIdProperty } from '@libs/platform/common';
import { ColumnDef } from '../../../grid';
import { IEditorDialogOptions } from '../../base';
import { IGridConfigDialogColumnsEntity } from './grid-config-dialog-columns-entity.interface';
import { IGridConfigDialog } from './grid-config-dialog.interface';

/**
 * Stores options for a grid config dialog.
 *
 * @typeParam TItem The item type shown in the lists.
 *
 * @group Dialogs
 */
export interface IGridConfigDialogOptions<TItem extends IGridConfigDialogColumnsEntity> extends IEditorDialogOptions<TItem[], IGridConfigDialog<TItem>> {
	/**
	 * Unique id for entity.
	 */
	idProperty: SimpleIdProperty<TItem>;

	/**
	 * Configuration options for the grid of selected items in the dialog box, including the list of columns.
	 * Can be used for adding additional column configurations.
	 */
	additionalSelectedGridColumns?: ColumnDef<TItem>[];

	/**
	 * A array of all available items.
	 */
	allItems: TItem[];
}
