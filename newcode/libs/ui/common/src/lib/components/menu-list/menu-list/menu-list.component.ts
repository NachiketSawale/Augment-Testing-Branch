/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { IMenuItemsList } from '../../../model/menu-list/interface/menu-items-list.interface';
import { IMenuItem } from '../../../model/menu-list/interface/menu-item.interface';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { ClassList } from '../../../model/menu-list/enum/class-list.enum';

/**
 * Renders a menu list of buttons according to their type.
 *
 * @typeParam TContext An object that represents the context in which the menulist appears.
 *
 * @group Menu List
 */
@Component({
	selector: 'ui-common-menu-list',
	templateUrl: './menu-list.component.html',
	styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent<TContext = void> {
	/**
	 * check the menu list is sublist
	 */
	@Input() public sublist = false;

	/**
	 *  Contains menu list items.
	 */
	@Input() public menu: IMenuItemsList<TContext> = {
		cssClass: '',
		items: [],
		showImages: false,
		showTitles: false,
		activeValue: '',
		overflow: false,
		iconClass: '',
		layoutChangeable: false,
	};

	/**
	 *  enum for menu item type
	 */
	public ItemType = ItemType;

	/**
	 * This method used to get the classname of menulist item.
	 * @param {IMenuItem} item  The menu item
	 * @returns {string | undefined}   CSS classes list for menu list
	 */
	public getClass(item: IMenuItem<TContext>): string | undefined {
		let classList;
		if (this.menu) {
			switch (item.type) {
				case ItemType.Divider:
					classList = this.sublist ? ClassList.divider : ClassList.collapsable + ' ' + ClassList.divider;
					break;
				case ItemType.Item:
				case ItemType.FileSelect:
					classList = this.sublist ? '' : ClassList.collapsable;
					break;
				case ItemType.DropdownBtn:
					classList = this.sublist ? ClassList.dropdown + item.id : ClassList.dropdown + item.id + ' ' + ClassList.collapsable;
					break;
				case ItemType.Sublist:
					classList = this.sublist ? ClassList.sublist : ClassList.collapsable + ' ' + ClassList.sublist;
					break;
				case ItemType.Radio:
					classList = this.sublist ? '' : ClassList.collapsable;
					break;
				case ItemType.Check:
					classList = this.sublist ? '' : ClassList.collapsable;
					break;
				case ItemType.OverflowBtn:
					classList = ClassList.fix;
					break;
				default:
					classList = '';
			}
		}
		return classList;
	}

	/**
	 * This method is used to css class of items.
	 * @param {IMenuItemsList} item   The menu list item
	 * @returns {string | undefined}  CSS classes for menu item
	 */

	public getItemClass(item: IMenuItemsList<TContext>): string | undefined {
		let cssClasses = item?.cssClass;
		if ((item?.showImages && !cssClasses?.includes(ClassList.showimages)) || cssClasses?.includes(ClassList.radioGroup)) {
			cssClasses = cssClasses + ' ' + ClassList.showimages;
		}
		return cssClasses;
	}

	/**
	 * This method is provides visibility of menulist
	 * @param {IMenuItemsList} item  the menulist item
	 * @returns {boolean| undefined}  Visibility of item
	 */

	public getVisibility(item: IMenuItemsList<TContext>): boolean | undefined {
		if (item.isVisible || typeof item.isVisible === 'undefined') {
			return false;
		}
		return true;
	}

	/**
	 * Indicates whether a given menu item is hidden.
	 *
	 * @param item The menu item.
	 *
	 * @returns A value that indicates whether the item should be hidden.
	 */
	public isItemHidden(item: IMenuItem<TContext>): boolean {
		if (typeof item.hideItem === 'boolean') {
			return item.hideItem;
		} else if (typeof item.hideItem === 'function') {
			return item.hideItem({
				item: item,
				context: this.context,
				isChecked: false // TODO: fix this - this is not the actual isChecked value for some items
			});
		}

		return false;
	}

	/**
	 * The context object of the menu list.
	 */
	@Input()
	public context!: TContext;
}
