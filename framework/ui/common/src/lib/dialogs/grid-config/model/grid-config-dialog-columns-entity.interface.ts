/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridConfigDialogReadOnlyData } from './grid-config-dialog-readonly-data.interface';

/**
 * Dialog entity fields readonly data
 */
export type IGridConfigDialogColumnsData = IGridConfigDialogColumnsEntity & IGridConfigDialogReadOnlyData;

/**
 * Dialog data.
 */
export interface IGridConfigDialogColumnsEntity {
	/**
	 * Field description.
	 */
	name: string;

	/**
	 * Width of the field.
	 */
	width: number;

	/**
	 * Label name entered by the user.
	 */
	userLabelName: string;

	/**
	 * Label to be selected by the user.
	 */
	labelCode: string;

	/**
	 * Is position of the field fixed.
	 */
	pinned: boolean;

	/**
	 * Is keyboard enter present.
	 */
	enter: boolean;
}
