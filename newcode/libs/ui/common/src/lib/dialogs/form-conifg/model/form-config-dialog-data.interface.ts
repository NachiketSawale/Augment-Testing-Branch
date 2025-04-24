/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormConfigDialogReadOnlyData } from './form-config-dialog-read-only-data.interface';

/**
 * Dialog entities.
 */
export interface IFormConfigDialogData extends IFormConfigDialogColumnsData, IFormConfigDialogReadOnlyData {
	/**
	 * Group Id to which row belongs.
	 */
	groupId: string | number;

	/**
	 * Row Id of the row.
	 */
	rowId: string | number;
}

export interface IFormConfigDialogColumnsData {
	/**
	 * Fixed label.
	 */
	label: string;

	/**
	 * Label name entered by the user.
	 */
	userLabelName: string;

	/**
	 * Label to be selected by the user.
	 */
	labelCode: string;

	/**
	 * Is row visible.
	 */
	visible: boolean;

	/**
	 * Is enter stop.
	 */
	enterStop: boolean;
}

