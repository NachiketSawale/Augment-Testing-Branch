/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IGridConfiguration } from '../../../grid';
import { IMenuItemsList } from '../../../model/menu-list/interface/index';
import { IGridDialog } from './grid-dialog.interface';
import { IFieldValueChangeInfo } from '../../../model/fields';
import { Translatable } from '@libs/platform/common';

export interface IGridDialogData<T extends object> {
	/**
	 * Title displayed right above grid and displayed only when tools are set.
	 */
	title?: Translatable;

	/**
	 * Indicates whether multiple rows in the grid may be selected at a time.
	 * The default value is `true`.
	 */
	allowMultiSelect?: boolean;

	/**
	 * Indicates whether the dialog exists only for information purposes and should therefore
	 * only have an *OK* button (unless you define any buttons on the options object).
	 * The default value is `false`.
	 * Note that this setting does not have any influence on the content of the dialog box.
	 */
	isReadOnly?: boolean;

	/**
	 * Custom tools
	 */
	tools?: IMenuItemsList<IGridDialog<T>>;

	/**
	 * Configuration options for the grid in the dialog box, including the list of columns.
	 */
	gridConfig: Omit<IGridConfiguration<T>, 'items'>;

	/**
	 * Call back when field value is changed.
	 */
	onCellValueChanged?(data: IGridDialog<T>, info: IFieldValueChangeInfo<T>): void;
}

/**
 * Token for dialog body data.
 */
const GRID_DIALOG_DATA_TOKEN = new InjectionToken('dlg-grid-data');

/**
 * Function returns Token for dialog body data.
 *
 * @returns {InjectionToken<IGridDialogData<T>>} Token for dialog body data.
 */
export function getGridDialogDataToken<T extends object>(): InjectionToken<IGridDialogData<T>> {
	return GRID_DIALOG_DATA_TOKEN;
}
