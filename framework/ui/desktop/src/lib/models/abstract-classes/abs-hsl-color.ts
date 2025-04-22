/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import * as _ from 'lodash';

/**
 * An abstract class that initializes an HSL color. If h, s and l are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
 * @param {Number} h The hue component. A value between 0 and 255
 * @param {Number} s The satuation component. A value between 0 and 1.
 * @param {Number} l The lightness component. A value between 0 and 1.
 * @param {number} opacity The opacity compnent. A value between 0 and 1.
 */
export abstract class AbsHslColor {
	/**
	 * variable for hue that contains the value between 0 and 255
	 */
	abstract h: number;

	/**
	 * variable for satuation that contains the value between 0 and 1.
	 */
	abstract s: number;

	/**
	 *  variable for lightness that contains value between 0 and 1.
	 */
	abstract l: number;

	/**
	 * The opacity compnent. A value between 0 and 1.
	 */
	abstract opacity: number;

	/**
	 * Generates an string that represents the color.
	 * @returns {String} The resulting string.
	 */
	public toString(): string {
		return 'hsla(' + _.round(this.h) + ',' + _.round(this.s * 100) + '%,' + _.round(this.l * 100) + '%,' + this.opacity + ')';
	}

	/**
	 * Returns a darker copy of this color. Lightness is reduced by the passed step value, it defaults to 0.15.
	 * @param {number} step The value by which the lightness should be reduced. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	public abstract darken(step: number): object;

	/**
	 * Returns a lighten copy of this color. Lightness is increased by the passed step value, it defaults to 1.
	 * @param {number} step The value by which the lightness should be increased. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	public abstract lighten(step: number): object;

	/**
	 * Returns a lighten or darken copy of this color depending on the threshold value passed. Lightness is changed by the passed step value, it defaults to 1.
	 * @param {number} threshold The threshold value above which the color should be darkened. Otherwise the color is lightened. Maximum value is 255.
	 * @param {number} step The value by which the lightness should be changed. Maximum value is 1.
	 * @returns {object} The resulting hsl color.
	 */
	public abstract variant(threshold: number, step: number): object;

	/**
	 * Generates an Int that represents the color. Opacity isn't supported.
	 * @returns {number} The resulting number.
	 */
	public abstract toInt(): number;
}
