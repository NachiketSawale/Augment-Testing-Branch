/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * This object stores image select items information.
 */
export interface IImageSelectItem {
	/**
	 * Image Id.
	 */
	readonly id: number;
	/**
	 * Image displayName.
	 */
	readonly displayName: string;
	/**
	 * Image iconCSS.
	 */
	readonly iconCSS: string;
	/**
	 * IsSelected flag.
	 */
	isSelected: boolean;
}
