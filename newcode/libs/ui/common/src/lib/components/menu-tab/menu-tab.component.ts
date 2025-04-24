/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IMenuTabParam } from '../../model/menu-tab/interface/menu-tab-param.interface';

@Component({
	selector: 'ui-common-menu-tab',
	templateUrl: './menu-tab.component.html',
	styleUrls: ['./menu-tab.component.scss'],
})
/**
 * Renders the tab details and provides menu tab functionality.
 */
export class MenuTabComponent {

	/**
	 * Stores the input tah array details
	 */
	@Input() public menuTabs: IMenuTabParam[] = [];

	/**
	 * Output event to provide selected tab details.
	 */
	@Output() public tabSelected: EventEmitter<IMenuTabParam> = new EventEmitter<IMenuTabParam>();

	/**
	 * Function to keep only selected menu tab in active state.
	 * @param event
	 */
	public onTabChange(event: MatTabChangeEvent): void {
		this.menuTabs.forEach(tab => tab.isActive = false);
		const selectedTab = this.menuTabs[event.index];
		selectedTab.isActive = true;
		this.tabSelected.emit(selectedTab);
	}

}
