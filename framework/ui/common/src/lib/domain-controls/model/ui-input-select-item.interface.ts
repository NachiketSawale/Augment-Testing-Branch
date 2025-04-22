/**
 * Copyright(c) RIB Software GmbH
 */

/**
 * This object stores ui input select items information.
 */
export interface IUiInputSelectItem {
	/**
	 * Id.
	 */
	readonly id: string;

	/**
	 * DisplayName.
	 */
	displayName: string;

	/**
	 * IsSelected flag.
	 */
	isSelected: boolean;
}
