/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ISidebarFavoriteAccordionData } from '../../../model/interfaces/favorites/sidebar-favorites-accordion-data.interface';

/**
 * This class renders the project favorites list.
 */
@Component({
	selector: 'ui-sidebar-favorites-sidebar-main',
	templateUrl: './favorites-sidebar-main.component.html',
	styleUrls: ['./favorites-sidebar-main.component.scss'],
})
export class UiSidebarFavoritesSidebarMainComponent {
	/**
	 * Accordion Data to display.
	 */
	@Input() public favoriteAccordionData: ISidebarFavoriteAccordionData[] = [];

	/**
	 * panel closed/collapsed event.
	 */
	@Output() public closed = new EventEmitter<ISidebarFavoriteAccordionData>();

	/**
	 * panel opened/expanded event.
	 */
	@Output() public opened = new EventEmitter<ISidebarFavoriteAccordionData>();

	/**
	 * accordion item selected event
	 */
	@Output() public selected = new EventEmitter<ISidebarFavoriteAccordionData>();

	/**
	 * Gets called when panel is expanded.
	 *
	 * @param {ISidebarFavoriteAccordionData} panelData.
	 */
	public onPanelExpand(panelData: ISidebarFavoriteAccordionData) {
		this.opened.emit(panelData);
	}

	/**
	 * Gets called when panel is collapsed.
	 *
	 * @param {ISidebarFavoriteAccordionData} panelData.
	 */
	public onPanelCollapse(panelData: ISidebarFavoriteAccordionData) {
		this.closed.emit(panelData);
	}

	/**
	 * Gets called when panel/item is selected.
	 *
	 * @param {ISidebarFavoriteAccordionData} event.
	 */
	public onPanelSelected(event: ISidebarFavoriteAccordionData) {
		this.selected.emit(event);
	}
}
