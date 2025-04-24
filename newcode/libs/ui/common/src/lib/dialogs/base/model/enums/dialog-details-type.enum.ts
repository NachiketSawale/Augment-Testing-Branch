/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the type of details area in a dialog box.
 *
 * @group Dialog Framework
 */
export enum DialogDetailsType {
	/**
	 * Details with longtext type.
	 */
	LongText = 'longtext',

	/**
	 * Details with grid type.
	 */
	Grid = 'grid',

	/**
	 * Details based on a custom component.
	 */
	Custom = 'custom'
}
