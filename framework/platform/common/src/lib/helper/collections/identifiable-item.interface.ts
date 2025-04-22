/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * A common interface for items that sport an ID property.
 *
 * @template {any} TId - The item ID type.
 */
export interface IIdentifiableItem<TId> {

	/**
	 * The unique ID of the item.
	 */
	readonly id: TId;
}