/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMenuItem } from '../../../model/menu-list/interface/menu-item.interface';
import { IMenuItemsList } from '../../menu-list/interface/menu-items-list.interface';
import { IIsExist } from './isexist.interface';

/**
 * The interface is for toolbar base class.
 */
export interface IToolbar {
	/**
	 * collection of menuitems
	 */
	toolbar: IMenuItem[];

	/**
	 * The toolbar layout button functionality.
	 */
	selectDropdownItem(id: string): void;

	/**
	 * 	The refactoreList.
	 */
	refactorList(list: IMenuItem[], removeOverflow: boolean): IMenuItem[];

	/**
	 * 	Create create menu list item.
	 */
	create(): IMenuItemsList;

	/**
	 * 	Create group id.
	 */

	createGroupId(tools: IMenuItem[]): IMenuItem[];

	/**
	 * 	Group Exists or not.
	 */

	isGroupExists(groupId: string): IIsExist;

	/**
	 * 	Item Exists or not.
	 */
	isItemExist(itemId: string): IIsExist;

	/**
	 * 	Add Item.
	 */
	addItems(items: IMenuItem | IMenuItem[], grpId?: string): void;

	/**
	 * 	Create group.
	 */
	createGroup(items: IMenuItem | IMenuItem[]): IMenuItem;

	/**
	 * 	Add Item or items.
	 */
	addItemsAtId(itemId: string, position: string, items: IMenuItem | IMenuItem[]): void;

	/**
	 * 	give items of given item.
	 */
	getItemsById(itemId: string, deep: boolean): IMenuItem | undefined;

	/**
	 * 	Find Item.
	 */
	findItem(item: IMenuItem, id: string): IMenuItem | undefined;

	/**
	 * 	delete item.
	 */
	deleteItems(itemsIds: string[]): void;

	/**
	 * 	Add item class.
	 */
	addItemClass(itemId: string, cssClass: string): void;

	/**
	 * 	remove item class.
	 */
	removeItemClass(itemId: string, cssClass: string): void;

	/**
	 * 	toggle item class.
	 */
	toggleItemClass(itemId: string, cssClass: string): void;

	/**
	 * 	Hide item.
	 */
	hideItem(itemId: string, value: boolean): void;

	/**
	 * 	Add Group.
	 */
	addGroups(group: IMenuItem, groupId?: string): void;

	/**
	 * 	add overflow button at last.
	 */
	ensureOverFlowAtLast(list: IMenuItem[]): IMenuItem[];
}
