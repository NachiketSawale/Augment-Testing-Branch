/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Display modes for a regular form configuration.
 *
 * @group Form Generator
 */
export enum FormDisplayMode {

	/**
	 * The form is displayed with a column for labels and another column for controls.
	 * This is considered the default display mode.
	 *
	 * Note that in this mode, controls without a label will span the full width, including
	 * the labels column.
	 */
	TwoColumns = 0,

	/**
	 * The form is displayed in such a way that it fits well into narrow spaces.
	 */
	Narrow = 1
}