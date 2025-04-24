/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';
import { ConcreteMenuItem, IRadioMenuItem } from '../../../model/menu-list/interface/index';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

/**
 * Display menu list type button.
 */
@Component({
	selector: 'ui-common-menu-list-radio',
	templateUrl: './menu-list-radio.component.html',
	styleUrls: ['./menu-list-radio.component.scss'],
})
export class MenuListRadioComponent<TContext> extends MenuListItemBaseComponent<TContext> {

	/**
	 * Menu Items Object
	 */
	@Input() public menuItem!: ConcreteMenuItem<TContext>;

	public get typedMenuItem(): IRadioMenuItem<TContext> {
		if (this.menuItem.type !== ItemType.Radio) {
			throw new Error('No suitable menu item assigned.');
		}

		return this.menuItem;
	}


	/**
	 * Get active value of radio type button object
	 */
	@Input() public activeValue!: string | boolean | number |undefined;

	/**
	 * show title of the menu items.
	 */
	@Input() public showTitles!: boolean;

	/**
	 * Indicates whether the menu item is checked.
	 * Some item types will always return `false`.
	 */
	protected override get isChecked(): boolean {
		return (this.typedMenuItem.value ?? this.menuItem.id) === this.activeValue;
	}
}
