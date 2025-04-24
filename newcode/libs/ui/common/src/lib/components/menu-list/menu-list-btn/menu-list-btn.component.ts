/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { IMenuItem } from '../../../model/menu-list/interface/menu-item.interface';

import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';

/**
 * Displays menu item of type button
 */
@Component({
	selector: 'ui-common-menu-list-btn',
	templateUrl: './menu-list-btn.component.html',
	styleUrls: ['./menu-list-btn.component.scss'],
})
export class MenuListBtnComponent<TContext> extends MenuListItemBaseComponent<TContext>  {

	/**
	 * Menu items Object
	 */
	@Input() public menuItem!: IMenuItem<TContext>;

	 /**
	 * show title of the menu items.
	 */
	@Input() public showTitles!: boolean;

}
