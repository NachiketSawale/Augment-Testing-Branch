/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentifiableItem } from './identifiable-item.interface';

/**
 * An interface for objects that store changes to a list of items.
 *
 * @template {IIdentifiable<TKey>} TItem - The item type.
 * @template {any} TId - The item ID type.
 */
export interface ICollectionChange<TItem extends IIdentifiableItem<TKey>, TKey> {

	/**
	 * The optional list of added items.
	 */
	readonly added: TItem[] | undefined;

	/**
	 * The optional list of modified items.
	 */
	readonly modified: TItem[] | undefined;

	/**
	 * The optional list of item IDs of removed items.
	 */
	readonly removed: TKey[] | undefined;
}