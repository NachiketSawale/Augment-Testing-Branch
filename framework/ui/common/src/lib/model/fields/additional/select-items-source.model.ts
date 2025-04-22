/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType, Translatable } from '@libs/platform/common';

/**
 * Represents an item in a select control.
 *
 * @group Fields API
 */
export interface ISelectItem<TKey extends PropertyType> {
	/**
	 * The unique ID that identifies the item.
	 */
	readonly id: TKey;

	/**
	 * The human-readable name of the item.
	 */
	readonly displayName: Translatable;

	/**
	 * Icon class name required for input select.
	 */
	readonly iconCSS?: string; // TODO this has been requested by Fatih, need to verify by Florian and Michael.
}

/**
 * Represents a source for items to pick from in a select control.
 */
export interface ISelectItemsSource<TKey extends PropertyType> {
	/**
	 * The items.
	 */
	readonly items: ISelectItem<TKey>[];
}
