/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog } from '../../base';
import { IGridConfigDialogColumnsEntity } from './grid-config-dialog-columns-entity.interface';

export interface IGridConfigDialog<TItem extends IGridConfigDialogColumnsEntity> extends IEditorDialog<TItem[]> {
	/**
	 * A array of all available items.
	 */
	allItems: TItem[];
}
