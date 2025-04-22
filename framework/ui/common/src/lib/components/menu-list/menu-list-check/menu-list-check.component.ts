/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { ConcreteMenuItem, ICheckMenuItem } from '../../../model/menu-list/interface/index';

import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';

/**
 * Display menu item of type check
 */
@Component({
	selector: 'ui-common-menu-list-check',
	templateUrl: './menu-list-check.component.html',
	styleUrls: ['./menu-list-check.component.scss'],
})
export class MenuListCheckComponent<TContext> extends MenuListItemBaseComponent<TContext> {

	/**
	 * Menu Items Object
	 */
	@Input() public menuItem!: ConcreteMenuItem<TContext>;

	public get typedMenuItem(): ICheckMenuItem<TContext> {
		if (this.menuItem.type !== ItemType.Check) {
			throw new Error('No suitable menu item assigned.');
		}

		return this.menuItem;
	}

	 /**
	 * show title of the menu items.
	 */
	@Input() public showTitles!: boolean;

	/**
	 * Indicates whether the menu item is checked.
	 * Some item types will always return `false`.
	 */
	protected override get isChecked(): boolean {
		return Boolean(this.typedMenuItem.value);
	}

}
