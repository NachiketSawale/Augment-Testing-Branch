/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An abstract class that initializes an Int color. If a CSS Color Module Level 3 specifier string is specified (e.g. "red"), it is parsed and then converted to the Int color space.
 * @param {object} value The int value.
 */
export abstract class AbsIntColor {
	abstract value: object | number;

	/**
	 * Generates an string that represents the color.
	 * @returns {string} The resulting string.
	 */
	public toString(): string {
		return this.value.toString();
	}

	/**
	 * Generates an RgbColor that represents the color.
	 * @returns {object} The resulting RgbColor.
	 */
	public abstract toRgb(): object;

	/**
	 *  Generates an HslColor that represents the color.
	 * @returns {object} The resulting HslColor.
	 */
	public abstract toHsl(): object;
}
