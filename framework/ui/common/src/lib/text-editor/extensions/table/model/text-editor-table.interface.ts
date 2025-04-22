/*
 * Copyright(c) RIB Software GmbH
 */

import { RgbColor } from '@libs/platform/common';

/**
 * DOM Position
 */
export interface IPosition {
	/**
	 * top position
	 */
	top: string | number;
	/**
	 * left position
	 */
	left: string | number;
	/**
	 * marginLeft position
	 */
	marginLeft: string | number;
	/**
	 * marginRight position
	 */
	marginRight: string | number;
}

/**
 * Selected Range in text editor
 */
export interface IRange {
	/**
	 * index
	 */
	index: number;
	/**
	 * length
	 */
	length: number;
}

/**
 * Tabel Cell Dailog Option
 */
export interface ICellDialogOptions {
	/**
	 * Tabel Cell Width
	 */
	cellWidth: number;

	/**
	 * Table Cell Border Width
	 */
	borderWidth: number | string;

	/**
	 * Table Cell Border Color
	 */
	borderColor: RgbColor | string;

	/**
	 * Table Cell Text Align
	 */
	horizontal: string;
}
