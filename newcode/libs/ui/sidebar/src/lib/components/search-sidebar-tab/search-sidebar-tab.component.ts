/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';

import { PlatformTranslateService } from '@libs/platform/common';

import { IMenuItemsList, IRadioMenuItem, ItemType } from '@libs/ui/common';
import { ISimpleSearchConfigOption } from '../../model/interfaces/simple-search-config-options.interface';

/**
 *Implements the basic functionality for Search Sidebar
 */
@Component({
	selector: 'ui-sidebar-search-sidebar-tab',
	templateUrl: './search-sidebar-tab.component.html',
	styleUrls: ['./search-sidebar-tab.component.scss'],
})
export class UiSidebarSearchSidebarTabComponent {
	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * The searchOptions object defines properties for a search feature
	 */
	public searchOptions: ISimpleSearchConfigOption = {
		toolBarDefs: {} as IMenuItemsList,
		title: this.translate.instant('cloud.desktop.sdMainSearchTitle').text,
		cssClass: '',
		searchType: '',
		settingsActive: false,
	};

	/**
	 * An array of toolbar items for selecting different search types and associated functions to handle the
	 * selection.
	 */
	private toolbarItems: IRadioMenuItem[] = [
		{
			id: 'gSearch',
			caption: { key: 'cloud.desktop.sdMainSearchBtnGoogle' },
			type: ItemType.Radio,
			groupId: 'google',
			iconClass: 'tlb-icons ico-sdb-search1',
			fn: () => {
				this.searchOptions.searchType = 'google';
			},
		},
		{
			id: 'fSearch',
			caption: { key: 'cloud.desktop.searchform.maintitle' },
			type: ItemType.Radio,
			groupId: 'form',
			iconClass: 'tlb-icons ico-sdb-search3',
			fn: () => {
				this.searchOptions.searchType = 'form';
			},
		},
		{
			id: 'bSearch',
			caption: { key: 'cloud.desktop.searchform.maintitle' },
			type: ItemType.Radio,
			groupId: 'bulkForm',
			iconClass: 'tlb-icons ico-sdb-search3',
			fn: () => {
				this.searchOptions.searchType = 'bulkForm';
			},
		},
	];

	public constructor() {
		this.searchOptions.searchType = 'google';

		this.searchOptions.toolBarDefs = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Sublist,
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						items: this.toolbarItems,
					},
				},
				{
					id: 'eSettings',
					caption: { key: 'cloud.desktop.sdMainSearchBtnSettings' },
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-settings searchSettings',
					fn: function () {},
					value: this.searchOptions.settingsActive,
				},
			],
		};
	}

	/**
	 * This method translates a given caption using a translation service and returns the text
	 * @method getTitle
	 * @param effectiveCaption caption of type string
	 */
	public getTitle(effectiveCaption: string): string {
		return this.translate.instant(effectiveCaption).text;
	}
}
