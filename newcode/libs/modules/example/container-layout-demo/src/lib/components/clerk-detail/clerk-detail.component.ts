/**
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';

import { IMenuItemsList } from '@libs/ui/common';

import { ContainerBaseComponent } from '@libs/ui/container-system';

/**
 * container registering the tools
 */
@Component({
	selector: 'example-container-layout-demo-clerk-detail',
	templateUrl: './clerk-detail.component.html',
	styleUrls: ['./clerk-detail.component.scss'],
})
export class BasicsClerkDetailComponent extends ContainerBaseComponent {
	/**
	 * toolbar items
	 */
	private toolbarItems!: IMenuItemsList;

	/**
	 * Initializes component and sets tools
	 */
	public constructor() {
		super();
		this.setTools();
	}

	/**
	 * register tools using toolbar object
	 */
	private setTools() {
		// TODO: update to adhere to fixed menulist interface
		/*const toolbarObj = this.uiAddOns.toolbar;
		 this.toolbarItems = toolbarObj.create();

		toolbarObj.addItems([
			{
				caption: { text: 'wizards' },
				hideItem: false,
				iconClass: 'tlb-icons ico-delete',
				id: 't201',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 300,
				type: ItemType.Item,
			},
			{ id: 'd0', type: ItemType.Divider, hideItem: false },
			{
				caption: { key: 'cloud.common.taskBarNewRecord' },
				disabled: true,
				hideItem: false,
				iconClass: 'tlb-icons ico-rec-new',
				id: 'create',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 0,
				type: ItemType.Item,
			},
			{ id: 'd0', type: ItemType.Divider, hideItem: false },
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				disabled: true,
				hideItem: false,
				iconClass: 'tlb-icons ico-rec-delete',
				id: 'delete',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 10,
				type: ItemType.Item,
			},
			{
				caption: { text: 'radio group caption' },
				groupId: 'dropdown-btn-radio2',
				hideItem: false,

				iconClass: 'tlb-icons ico-watchlist-add',
				id: 'radio2',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				layoutChangeable: true,
				layoutModes: 'vertical',
				type: ItemType.DropdownBtn,
				list: {
					activeValue: 'Combined',
					cssClass: 'radio-group',
					showTitles: true,
					items: [
						{
							caption: { key: 'cloud.common.addWawatchlist' },
							fn: () => {
								throw new Error('This method is not implemented');
							},
							iconClass: 'tlb-icons ico-watchlist-add',
							id: 't-addtowatchlist',
							sort: 110,
							type: ItemType.Item,
						},
						{
							caption: { key: 'cloud.common.bulkEditor.title' },
							fn: () => {
								throw new Error('This method is not implemented');
							},
							hideItem: false,
							iconClass: 'type-icons ico-construction51',
							id: 't1444',

							sort: 140,
							type: ItemType.Item,
						},
						{
							caption: { key: 'cloud.common.taskBarColumnFilter' },
							fn: () => {
								throw new Error('This method is not implemented');
							},
							hideItem: false,
							iconClass: 'tlb-icons ico-search-column',
							id: 'gridSearchColumn',
							sort: 160,
							type: ItemType.Check,
						},
					],
				},
			},
		]);

		this.toolbarItems.items = toolbarObj.toolbar;
		this.toolbarItems.showImages = true;
		this.toolbarItems.cssClass = 'tools ';
		this.toolbarItems.overflow = true;
		this.toolbarItems.isVisible = true;

		this.toolbarService.addTools(this.toolbarItems);*/
	}
}
