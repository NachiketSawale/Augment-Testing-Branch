/*
 * Copyright(c) RIB Software GmbH
 */
import { GridItemId } from '../../../grid';
import { IFormConfigDialogData } from './form-config-dialog-data.interface';

/**
 * Dialog result
 */
export interface IFormConfigDialogState<T extends IFormConfigDialogData> {
	/**
	 * The ID of the selected item in the grid.
	 */
	selectedItem?: GridItemId;
	
	/**
	 * Form groups.
	 */
	groups: Omit<IFormConfigDialogData, 'rowId'>[];

	/**
	 * Form rows.
	 */
	rows: T[];
}
