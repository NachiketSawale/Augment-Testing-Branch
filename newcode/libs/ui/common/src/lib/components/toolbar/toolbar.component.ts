/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { IMenuItemsList } from '../../model/menu-list/interface/menu-items-list.interface';

/**
 * Provides tools to display for menu list.
 *
 * @group Menu List
 */
@Component({
	selector: 'ui-common-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  {

	/**
 	* List of tools 
 	*/
	@Input() public toolbarData : IMenuItemsList|undefined= {
		cssClass: '',
		items: [],
		showImages: false,
		showTitles: false,
		activeValue: '',
		overflow: false,
		iconClass: '',
		layoutChangeable: false,
	};

}
