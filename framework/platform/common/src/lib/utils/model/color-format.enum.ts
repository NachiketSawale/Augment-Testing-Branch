/*
 * Copyright(c) RIB Software GmbH
 */

import { RgbColor } from './rgb-color.class';

/**
 * Indicates a format for specifying a color value.
 */
export enum ColorFormat {

	/**
	 * The color is represented by an {@link RgbColor} object.
	 */
	RgbColor = 'rgbObj',

	/**
	 * The color is represented by an integer value in RGBA format.
	 */
	RgbaValue = 'rgba',

	/**
	 * The color is represented by an integer value in ARGB format.
	 */
	ArgbValue = 'argb'
}

/**
 * Represents data types that can store a color value.
 */
export type ColorType = RgbColor | number;