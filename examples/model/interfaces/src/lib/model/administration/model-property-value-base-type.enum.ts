/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the data types supported for model property values.
 */
export enum ModelPropertyValueBaseType {

	/**
	 * A string.
	 */
	Text = 1,

	/**
	 * A floating-point number.
	 */
	Float = 2,

	/**
	 * An integer number.
	 */
	Integer = 3,

	/**
	 * A boolean value.
	 */
	Boolean = 4,

	/**
	 * A UTC date.
	 */
	Date = 5
}
