/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An abstract class that initialize an RGB color. If r, g and b are specified, these represent the channel values of the returned color; an opacity may also be specified. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the HSL color space.
 * @param {Number} r The red component. A value between 0 and 255.
 * @param {Number} g The green component. A value between 0 and 255.
 * @param {Number} b The blue component. A value between 0 and 255.
 * @param {number} opacity The opacity component. A value between 0 and 1.
 */
export abstract class AbsRgbColor {
	/**
	 * The red component. A value between 0 and 255.
	 */
	abstract r: number;

	/**
	 * The green component. A value between 0 and 255.
	 */
	abstract g: number;

	/**
	 * The green component. A value between 0 and 255.
	 */
	abstract b: number;

	/**
	 * The opacity component. A value between 0 and 1.
	 */
	abstract opacity: number;

	/**
	 * Generates an string that represents the color.
	 * @returns {String} The resulting string.
	 */
	public toString(): string {
		return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.opacity + ')';
	}

	/**
	 * Generates an Int that represents the color.
	 * @returns {number} The resulting number.
	 */
	public abstract toInt(): number;

	/**
	 * Generates an Int that represents the color.
	 * @returns {object} The resulting HSL object.
	 */
	public abstract toHsl(): object;
}
