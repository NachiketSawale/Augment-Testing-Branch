/*
 * Copyright(c) RIB Software GmbH
 */

import { IMenuItemsList } from './interface/menu-items-list.interface';
import { IMenuList } from '../../services/menu-list/menu-list.interface';
import { isGroupItemType, ItemType } from './enum/menulist-item-type.enum';
import { InsertPosition } from '../toolbar/enum/insert-position.enum';
import { ConcreteMenuItem, isParentMenuItem } from './interface/index';

/**
 * Represents the content of a menu list.
 *
 * @typeParam TContext An optional context object type.
 *
 * @group Menu List
 */
export class MenuListContent<TContext = void> implements IMenuList<TContext> {

	public items?: IMenuItemsList<TContext> = {
		items: []
	};

	/**
	 * Sets the visibility of the menu list.
	 */
	public isVisible? = true;

	/**
	 * Removes all items from the menu list.
	 */
	public clear() {
		if (this.items) {
			this.items.items = [];
		}
	}

	private readyItems() {
		if (!this.items) {
			this.items = {};
		}
		if (!this.items.items) {
			this.items.items = [];
		}
		// setting default css class for proper tool icon alignment
		this.items.cssClass = 'tools';
	}

	/**
	 * Adds one or more items at the end of the menu list.
	 * @param newItems The new items.
	 * @param groupId The group ID.
	 */
	public addItems(newItems: ConcreteMenuItem<TContext> | ConcreteMenuItem<TContext>[], groupId?: string) {
		this.readyItems();

		if (!Array.isArray(newItems)) {
			newItems = [newItems];
		}

		let targetList: ConcreteMenuItem<TContext>[] | undefined;
		if (groupId) {
			const grp = this.findGroup(groupId);
			if (grp && isParentMenuItem(grp)) {
				targetList = grp.list.items;
			}
		}

		if (!this.items?.items) {
			throw new Error('Target menu item list not ready.');
		}
		targetList ??= this.items.items;

		targetList.push(...newItems);
	}

	private findGroup(groupId: string, inItems?: ConcreteMenuItem<TContext>[]): ConcreteMenuItem<TContext> | undefined {
		inItems ??= this.items?.items;
		if (!inItems) {
			return undefined;
		}

		const groups = inItems?.filter(item => isGroupItemType(item.type ?? ItemType.Item));
		let result = groups.find(item => item.id === groupId);
		result ??= groups.map(grp => this.findGroup(groupId, (isParentMenuItem(grp) ? grp.list.items : null) ?? [])).find(item => Boolean(item));
		return result;
	}

	/**
	 * Adds one or more items at a specified position in the menu list.
	 * @param newItems The new items.
	 * @param itemId The ID of the item at which the insertion should take place.
	 * @param position Indicates the position at which to insert the new items.
	 * @returns A value that indicates whether the insertion was successful.
	 */
	public addItemsAtId(newItems: ConcreteMenuItem<TContext> | ConcreteMenuItem<TContext>[], itemId: string, position?: InsertPosition): boolean {
		if (!Array.isArray(newItems)) {
			newItems = [newItems];
		}
		position ??= InsertPosition.Before;

		// breadth-first search for insertion position
		const nextItemLists = [this.items?.items];

		while (nextItemLists.length > 0) {
			const itemList = nextItemLists.pop();
			if (itemList) {
				for (let i = itemList.length - 1; i >= 0; i--) {
					const item = itemList[i];
					if (item.id === itemId) {
						const insertionInfo = (function (): {
							index: number,
							deleteCount: number
						} {
							switch (position) {
								case InsertPosition.Before:
									return {
										index: i,
										deleteCount: 0
									};
								case InsertPosition.After:
									return {
										index: i + 1,
										deleteCount: 0
									};
								case InsertPosition.Instead:
									return {
										index: i,
										deleteCount: 1
									};
								default:
									throw new Error(`Unsupported insertion position: ${position}`);
							}
						})();

						itemList.splice(insertionInfo.index, insertionInfo.deleteCount, ...newItems);
						return true;
					} else {
						if (isParentMenuItem(item)) {
							nextItemLists.push(item.list.items);
						}
					}
				}
			}
		}

		return false;
	}

	/**
	 * Deletes items by their ID.
	 * @param itemIds The item IDs to remove.
	 * @returns A value that indicates whether all indicated IDs were deleted.
	 */
	public deleteItems(itemIds: string | string[]): boolean {
		// transform IDs to delete into easily queryable map
		const idsToDelete: {
			[key: string]: boolean
		} = {};

		if (Array.isArray(itemIds)) {
			for (const itemId of itemIds) {
				idsToDelete[itemId] = true;
			}
		} else {
			idsToDelete[itemIds] = true;
		}

		// breadth-first search for items to delete
		const nextItemLists = [this.items?.items];

		while (nextItemLists.length > 0) {
			const itemList = nextItemLists.pop();
			if (itemList) {
				for (let i = itemList.length - 1; i >= 0; i--) {
					const item = itemList[i];
					if (item.id && idsToDelete[item.id]) {
						itemList.splice(i, 1);
						idsToDelete[item.id] = false;
					} else {
						if (isParentMenuItem(item)) {
							nextItemLists.push(item.list.items);
						}
					}
				}
			}
		}

		for (const key in idsToDelete) {
			if (idsToDelete[key]) {
				return false;
			}
		}

		return true;
	}

	public setVisibility(isVisible: boolean) {
		this.isVisible = isVisible;
	}
}