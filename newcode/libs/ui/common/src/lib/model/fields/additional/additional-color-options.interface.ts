/*
 * Copyright(c) RIB Software GmbH
 */

import { ColorFormat } from '@libs/platform/common';

/**
 * Defines special options for color fields.
 *
 * @group Fields API
 */
export interface IAdditionalColorOptions {
	/**
	 * Specifies the format for color values.
	 * The default value is {@link ColorFormat.RgbColor}.
	 */
	format?: ColorFormat;
	/**
	 * This is used for show or hide the clear button
	 */
	showClearButton?: boolean;

	/**
	 * Specifies the info text
	 */
	infoText?: string;
}
