/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';

import { IMenuItem } from '../../../model/menu-list/interface/menu-item.interface';
import { IMenuItemsList } from '../../menu-list/interface/menu-items-list.interface';
import { IIsExist } from '../interface/isexist.interface';

import { PlatformCommonMainviewService, PlatformPermissionService } from '@libs/platform/common';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { InsertPosition } from '../enum/insert-position.enum';
import { ConcreteMenuItem, isParentMenuItem } from '../../menu-list/interface/index';

/**
 *  Class responsible to provide toolbar related method.
 */
export class ToolbarWrapper {
	/**
	 * The tool Items
	 */
	public toolItems: ConcreteMenuItem[] = [];

	/**
	 * Enum for tool item types
	 */
	public ItemType = ItemType;

	private readonly permissionService = inject(PlatformPermissionService);
	private readonly mainViewService = inject(PlatformCommonMainviewService);

	/**
	 * instantiates class with container uuid
	 */
	public constructor(public containerUuid: string) {}

	/**
	 * Gives toolbar items
	 * @returns {IMenuItem[]} Array of menu Item
	 */
	public get toolbar(): ConcreteMenuItem[] {
		if (this.toolItems.length > 0) {
			let tools = this.toolItems;
			tools = this.setPermission(tools);
			tools = tools.sort((p1, p2) => (p1.sort !== undefined && p2.sort !== undefined ? (p1.sort > p2.sort ? 1 : p1.sort < p2.sort ? -1 : 0) : 0));
			tools = this.refactorList(tools, false);
			tools = this.createGroupId(tools);
			return tools;
		} else {
			return this.toolItems;
		}
	}

	/**
	 * Sets permission for tool item
	 * @param tools  The tool item
	 */
	public setPermission(tools: ConcreteMenuItem[]) {
		tools.forEach((tool) => {
			if (isParentMenuItem(tool) && tool.list.items) {
				this.setPermission(tool.list.items);
			} else {
				if (Object.prototype.hasOwnProperty.call(tool, 'permission') && typeof tool.permission === 'string' && tool.permission.includes('#')) {
					const uuid = this.containerUuid;
					const split = tool.permission.split('#');
					tool.permission = {};
					tool.permission[split[0].length ? split[0] : this.mainViewService.getPermissions(uuid) || uuid] = this.permissionService.permissionsFromString(split[1]);
				}
			}
		});

		return tools;
	}

	/**
	 * It removes adjecent dividers, overflow if false
	 * @param list  Array of tool items
	 * @param removeOverflow  Decides to remove overflow
	 * @returns Array of refactored tool items
	 */
	public refactorList(list: ConcreteMenuItem[], removeOverflow: boolean): ConcreteMenuItem[] {
		let divider = false;
		for (let i = 0; i < list.length; i++) {
			if (!!removeOverflow && list[i].type === ItemType.OverflowBtn) {
				list.splice(i, 1);
				i--;
			}

			if (list[i].type === ItemType.Divider) {
				if (divider) {
					list.splice(i, 1);
					i--;
				}
				divider = true;
			} else {
				divider = false;
			}
		}

		if (list.length > 2) {
			if (list[list.length - 2].type === ItemType.Divider) {
				list.splice(list.length - 2, 1);
			}
		}
		list.forEach((item: IMenuItem) => {
			item.hideItem = false;
		});

		list = this.createOverflow(list);
		list = this.ensureOverFlowAtLast(list);

		return list;
	}

	/**
	 * Its check overflow exist if yes the return index number
	 * @param {IMenuItem[]} list The list of tool items
	 * @returns {number}  return overflow index
	 */
	public isOverflowExists(list: IMenuItem[]): number {
		const overflowIndex = list.findIndex((item) => item.type === ItemType.OverflowBtn);
		return overflowIndex;
	}

	/**
	 * Its create overflow
	 * @param {IMenuItem[]} list  list of tool items
	 * @returns {IMenuItem[]} list of tool items
	 */
	public createOverflow(list: ConcreteMenuItem[]): ConcreteMenuItem[] {
		let overflow;
		const overflowIndex = this.isOverflowExists(list);
		if (overflowIndex === -1) {
			const clonedArray = JSON.parse(JSON.stringify(list)) as typeof list;

			clonedArray.forEach((arr) => {
				if (isParentMenuItem(arr)) {
					arr.list.showTitles = true;
				}
			});

			overflow = {
				// TODO: check this caption
				caption: { key: 'cloud.common.viewerConfiguration' },
				iconClass: 'ico-menu',
				cssClass: 'fix',
				id: 'fixbutton',
				isDisplayed: false,
				type: ItemType.OverflowBtn,
				hideItem: true,
				list: {
					cssClass: ' dropdown-menu-right ',
					showImages: true,
					showTitles: true,
					items: clonedArray,
				},
			};
			list.push(overflow);
		}
		return list;
	}

	/**
	 * It add overflow button at last
	 * @param {IMenuItem[]} list list of tool items
	 * @returns {IMenuItem[]} list of tool items
	 */
	public ensureOverFlowAtLast(list: ConcreteMenuItem[]): ConcreteMenuItem[] {
		const overflowIndex = this.isOverflowExists(list);
		if (overflowIndex !== list.length - 1 && overflowIndex !== -1) {
			list.push(list.splice(overflowIndex, 1)[0]);
		}

		return list;
	}

	/**
	 * It creates empty toolbar
	 * @returns {IMenuItemsList} returns new tool list item
	 */
	public create(): IMenuItemsList {
		const item = {
			isVisible: false,
			cssClass: '',
			items: [],
			showImages: false,
			showTitles: false,
			overflow: false,
			iconClass: '',
			layoutChangeable: false,
			uuid: this.containerUuid,
		};

		return item;
	}

	/**
	 * It creates group id for every group using id of tool and type of tool
	 * @param tools list of tool items
	 * @returns list of tool items
	 */
	public createGroupId(tools: ConcreteMenuItem[]): ConcreteMenuItem[] {
		tools.forEach((tool) => {
			if (isParentMenuItem(tool) && tool.list.items) {
				const group = tool.id ? tool.id : tool.iconClass;
				const groupId = tool.type + '-' + group;
				tool.groupId = groupId;
			}
		});
		return tools;
	}

	/**
	 * Checks whether group exists or not and gives id of group if exists
	 * @param {string } groupId  Group id of tool item
	 * @returns {IIsExist} return isGroupExist with index
	 */
	public isGroupExists(groupId: string): IIsExist {
		const isGroupExist = {
			isExists: false,
			index: -1,
		};
		const index = this.toolItems.findIndex((item) => item.groupId === groupId);
		if (index !== -1) {
			isGroupExist.index = index;
			isGroupExist.isExists = true;
		}
		return isGroupExist;
	}

	/**
	 * It checks whether items exists, if exists gives index
	 * @param {string} itemId  Id of tool item
	 * @returns {IIsExist}  return isGroupExist with index
	 */
	public isItemExist(itemId: string): IIsExist {
		const isItemExist = {
			isExists: false,
			index: -1,
		};
		const index = this.toolItems.findIndex((item) => item.id === itemId);
		if (index !== -1) {
			isItemExist.index = index;
			isItemExist.isExists = true;
		}
		return isItemExist;
	}

	/**
	 * This method is used to change icon and caption.
	 * @param {string} id  Id of tool item
	 * @returns {void}
	 */
	public selectDropdownItem(id: string): void {
		let selectedItem!: ConcreteMenuItem | undefined;
		const dropDownItemsGroup: IMenuItem | undefined = this.toolItems.find((item: ConcreteMenuItem) => {
			if (isParentMenuItem(item)) {
				selectedItem = item.list.items?.find((element: IMenuItem) => element.id === id);
				return selectedItem;
			} else {
				return;
			}
		});

		if (dropDownItemsGroup && selectedItem?.type === ItemType.Radio) {
			if (isParentMenuItem(dropDownItemsGroup)) {
				dropDownItemsGroup.list.activeValue = selectedItem?.value;
				dropDownItemsGroup.iconClass = selectedItem?.iconClass;
				dropDownItemsGroup.caption = selectedItem?.caption;
			}
		}
	}

	/**
	 * Adds item or items to array. If groupId is set and exists item will be added in it.If groupId set and does not exists new group will be created. If groupId is not set item will be added at root
	 * @param items  list of tool items
	 * @param grpId optional parameter  Group id to new item in group
	 */
	public addItems(items: ConcreteMenuItem | ConcreteMenuItem[], grpId?: string): void {
		if (grpId) {
			const isGroup = this.isGroupExists(grpId);

			if (isGroup.isExists && isGroup.index !== -1) {
				if (Array.isArray(items)) {
					items.forEach((item) => {
						const groupItem = this.toolItems[isGroup.index];
						if (isParentMenuItem(groupItem)) {
							groupItem.list.items?.push(item);
						}
					});
				} else {
					const groupItem = this.toolItems[isGroup.index];
					if (isParentMenuItem(groupItem)) {
						groupItem.list.items?.push(items);
					}
				}
			} else {
				const group = this.createGroup(items);

				if (group.groupId !== grpId) {
					group.groupId = grpId;
				}
				this.toolItems.push(group);
			}
		} else {
			if (Array.isArray(items)) {
				items.forEach((item) => {
					this.toolItems.push(item);
				});
			} else {
				this.toolItems.push(items);
			}
		}
	}

	/**
	 * It creates a group
	 * @param items   List of tool items
	 * @returns Tool item
	 */
	public createGroup(items: ConcreteMenuItem | ConcreteMenuItem[]): ConcreteMenuItem {
		let itemCollection = [];

		Array.isArray(items) ? (itemCollection = items) : itemCollection.push(items);

		const group: ConcreteMenuItem = {
			id: '',
			caption: '',
			type: ItemType.Sublist,
			groupId: '',
			iconClass: '',
			list: {
				cssClass: '',
				showTitles: false,
				items: itemCollection,
			},

			hideItem: false,
		};

		return group;
	}

	/**
	 * It adds item or items at before or after of given id
	 * @param itemId Tool item ID
	 * @param position Required position to put tool item
	 * @param items  List of tool item
	 */
	public addItemsAtId(itemId: string, position: string, items: ConcreteMenuItem | ConcreteMenuItem[]): void {
		const isItem = this.isItemExist(itemId);

		let pos = position === InsertPosition.Before ? isItem.index : position === InsertPosition.After ? isItem.index + 1 : -1;

		if (isItem.isExists && isItem.index !== -1 && pos !== -1) {
			if (Array.isArray(items)) {
				items.forEach((item) => {
					this.toolItems.splice(pos, 0, item);
					pos++;
				});
			} else {
				this.toolItems.splice(pos, 0, items);
			}
		}
	}

	/**
	 * It give item of given id. Also searches inner structures if deep is true
	 * @param itemId Tool item id
	 * @param deep Searches inner structures if deep is true
	 * @returns Tool item
	 */
	public getItemsById(itemId: string, deep: boolean): ConcreteMenuItem | undefined {
		let result;
		if (deep) {
			for (const tool of this.toolItems) {
				result = this.findItem(tool, itemId);

				if (result) {
					break;
				}
			}
		} else {
			result = this.toolItems.find((item) => item.id === itemId);
		}

		return result;
	}

	/**
	 * Gets called recursively to find item according to id for inner structures. Returns undefind if item not found
	 * @param item  Tool item
	 * @param id   Tool item id
	 * @returns Tool item
	 */
	public findItem(item: ConcreteMenuItem, id: string): ConcreteMenuItem | undefined {
		if (item.id === id) {
			return item;
		}

		if (isParentMenuItem(item) && item.list.items) {
			for (const i of item.list.items) {
				const result: ConcreteMenuItem | undefined = this.findItem(i, id);
				if (result) {
					return result;
				}
			}
		}
		return;
	}

	/**
	 * It deletes item based on id from array of tools
	 * @param {string[]} itemsIds  Tool items id
	 * @returns {void}
	 */
	public deleteItems(itemsIds: string[]): void {
		this.toolItems = this.toolItems.filter((el: IMenuItem) => {
			if (typeof el.id !== 'undefined') {
				!itemsIds.includes(el.id);
			}
		});
	}

	/**
	 * Adds css class to item using id , if cssClass property doesn't exists sets with provided class.
	 * @param {string} itemId  Tool item id
	 * @param {string} cssClass Tool item css class
	 * @returns {void}
	 */
	public addItemClass(itemId: string, cssClass: string): void {
		const isExist = this.isItemExist(itemId);
		if (isExist.isExists && isExist.index !== -1) {
			if (Object.prototype.hasOwnProperty.call(this.toolItems[isExist.index], 'cssClass')) {
				this.toolItems[isExist.index].cssClass = this.toolItems[isExist.index].cssClass + ' ' + cssClass;
			}
			this.toolItems[isExist.index].cssClass = cssClass;
		}
	}

	/**
	 * It removes given css class from item according to id
	 * @param {string} itemId  Tool item id
	 * @param {string} cssClass  Tool item css class
	 * @returns {void}
	 */
	public removeItemClass(itemId: string, cssClass: string): void {
		const isExist = this.isItemExist(itemId);
		if (isExist.isExists && isExist.index !== -1) {
			if (Object.prototype.hasOwnProperty.call(this.toolItems[isExist.index], 'cssClass') && this.toolItems[isExist.index].cssClass?.includes(cssClass)) {
				this.toolItems[isExist.index].cssClass = this.toolItems[isExist.index].cssClass?.replace(cssClass, ' ');
			}
		}
	}

	/**
	 * It toggles css class of item based on id
	 * @param {string} itemId  Tool item id
	 * @param {string} cssClass Tool item css class
	 * @returns {void}
	 */
	public toggleItemClass(itemId: string, cssClass: string): void {
		const isExist = this.isItemExist(itemId);
		if (isExist.isExists && isExist.index !== -1) {
			if (Object.prototype.hasOwnProperty.call(this.toolItems[isExist.index], 'cssClass')) {
				if (this.toolItems[isExist.index].cssClass?.includes(cssClass)) {
					this.toolItems[isExist.index].cssClass = this.toolItems[isExist.index].cssClass?.replace(cssClass, ' ');
				} else {
					this.toolItems[isExist.index].cssClass = this.toolItems[isExist.index].cssClass + ' ' + cssClass;
				}
			} else {
				this.toolItems[isExist.index].cssClass = cssClass;
			}
		}
	}

	/**
	 * Changes visiblity of item using id
	 * @param {string} itemId  Tool item id
	 * @param {boolean} value  Boolean value for changing visiblity
	 * @returns {void}
	 */
	public hideItem(itemId: string, value: boolean): void {
		const isExist = this.isItemExist(itemId);
		if (isExist.isExists && isExist.index !== -1) {
			this.toolItems[isExist.index].hideItem = value;
		}
	}

	/**
	 * It add given group to array using groupId. If groupId is set and exists it wil add given group  as a subgroup. If groupId is set and doesn't exist group will be added to root. If groupId is not set group will be added to root.
	 * @param group Tool item group
	 * @param groupId optional Tool item id
	 */
	public addGroups(group: ConcreteMenuItem, groupId?: string): void {
		if (groupId) {
			const isGroupExist = this.isGroupExists(groupId);
			if (isGroupExist.isExists && isGroupExist.index !== -1) {
				const groupItem = this.toolItems[isGroupExist.index];
				if (isParentMenuItem(groupItem)) {
					groupItem.list.items?.push(group);
					return;
				}
			}
		}

		this.toolItems.push(group);
	}
}
