/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { ConcreteMenuItem, IMenuItemsList, ItemType } from '@libs/ui/common';

/**
 * Entity Filter Result toolbar Component
 */
@Component({
	selector: 'basics-shared-entity-filter-result-toolbar',
	templateUrl: './entity-filter-result-toolbar.component.html',
	styleUrl: './entity-filter-result-toolbar.component.scss'
})
export class BasicsSharedEntityFilterResultToolbarComponent implements OnInit {
	/**
	 * Toolbar title
	 */
	@Input()
	public title: string = '';

	/**
	 * Toolbar items
	 */
	@Input()
	public toolBarSettingItems: ConcreteMenuItem[] = [];

	/**
	 * Tools
	 */
	public tools: IMenuItemsList | undefined = undefined;

	/**
	 * Initialization
	 */
	public ngOnInit() {
		this.initTools();
	}

	private initTools() {
		this.tools = {
			cssClass: 'tools',
			items: [{
				id: 'entity-filter-result-toolbar-settings',
				type: ItemType.DropdownBtn,
				caption: {key: 'basics.common.settings'},
				iconClass: 'tlb-icons ico-settings',
				list: {
					cssClass: 'popup-menu',
					showTitles: true,
					showImages: false,
					items: this.getDefaultToolItems().concat(this.toolBarSettingItems)
				}
			}]
		};
	}

	private getDefaultToolItems(): ConcreteMenuItem[] {
		return [
			{
				id: 'configureTable',
				type: ItemType.Item,
				caption: {key: 'basics.shared.configureTable'},
				fn: () => {
					// TODO https://rib-40.atlassian.net/browse/DEV-34245
				},
				sort: 0
			},
			{
				id: 'configurePreview',
				type: ItemType.Item,
				caption: {key: 'basics.shared.configurePreview'},
				fn: () => {
					// TODO https://rib-40.atlassian.net/browse/DEV-34245
				},
				sort: 1
			}
		];
	}
}