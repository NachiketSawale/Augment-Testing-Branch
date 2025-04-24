/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../model/menu-list/enum/menulist-item-type.enum';
import {
	ConcreteMenuItem,
	IMenuItemsList
} from '../model/menu-list/interface/index';

/**
 * mockdata for menulist
 */
export const menu: IMenuItemsList = {
	isVisible: true,
	cssClass: 'tools ',
	items: [
		{
			caption: {
				text: 'wizards',
				key: 'wizards',
			},
			iconClass: 'tlb-icons ico-delete',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 8,
			},
			isSet: true,
			hideItem: false,
			id: 't200',
			sort: 300,
			type: ItemType.Item,
		},
		{
			id: 'd0',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarNewRecord',
				text: 'New Record',
			},
			iconClass: 'tlb-icons ico-rec-new',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 4,
			},
			disabled: true,
			hideItem: false,
			id: 'create',
			sort: 0,
			type: ItemType.Item,
			isSet: true,
		},
		{
			id: 'd0',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarDeleteRecord',
				text: 'Delete Record',
			},
			iconClass: 'tlb-icons ico-rec-delete',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 8,
			},
			disabled: true,
			hideItem: false,
			id: 'delete',
			sort: 10,
			type: ItemType.Item,
			isSet: true,
		},
		{
			id: 'd1',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarGrouping',
				text: 'Grouping',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-group-columns',
			id: 't12',
			sort: 10,
			type: ItemType.Check,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.filterByViewer',
				text: 'Filter by Model Object Selection',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-filter-by-model',
			id: 'toggleFilteringSelection',
			sort: 20,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				text: 'Pin Selected Item',
				key: 'Pin Selected Item',
			},
			cssClass: 'active',
			hideItem: false,
			iconClass: 'tlb-icons ico-set-prj-context',
			id: 't-pinningctx',
			sort: 120,
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.bulkEditor.title',
				text: 'Bulk Editor',
			},
			hideItem: false,
			iconClass: 'type-icons ico-construction51',
			id: 't14',
			sort: 140,
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.taskBarSearch',
				text: 'Search',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-search-all',
			id: 'gridSearchAll',
			sort: 150,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.exportClipboard',
				text: 'Clipboard',
			},
			cssClass: 'tlb-icons ico-clipboard ',
			groupId: 'dropdown-btn-t199',
			hideItem: false,
			iconClass: 'tlb-icons ico-clipboard',
			id: 't199',
			sort: 199,
			type: ItemType.DropdownBtn,
			list: {
				cssClass: 'dropdown-menu-right',
				showImages: false,
				showTitles: true,
				items: [
					{
						caption: {
							key: 'cloud.common.exportArea',
						},
						id: 't100',
						sort: 100,
						type: ItemType.Check,
						value: false,
					},
					{
						caption: {
							key: 'cloud.common.exportCopy',
						},
						id: 't200',
						sort: 200,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.exportPaste',
						},
						id: 't300',
						sort: 300,
						type: ItemType.Item,
					},
					{
						id: 'dCopyPaste',
						sort: 400,
						type: ItemType.Divider,
					},
					{
						caption: {
							key: 'cloud.common.exportWithHeader',
						},
						id: 't400',
						sort: 500,
						type: ItemType.Check,
					},
				],
			},
			isSet: true,
		},
		{
			caption: 'radio group caption',
			groupId: 'sublist-group_manupulation_operator',
			hideItem: false,
			iconClass: 'filterBoQ',
			id: 'group_manupulation_operator',
			layoutChangeable: true,
			layoutModes: 'horizontal',
			type: ItemType.Sublist,
			list: {
				activeValue: 'filterBoQ',
				cssClass: 'radio-group dropdown-menu-right',
				showTitles: false,
				items: [
					{
						caption: {
							key: 'cloud.common.filterAssigned',
							text: 'Show only the assigned line items of the current selection',
						},
						iconClass: 'tlb-icons ico-filter-assigned ',
						id: 'filterBoQ',
						isDisplayed: true,
						type: ItemType.Radio,
					},
					{
						caption: {
							key: 'cloud.common.filterAssignedAndNotAssigned',
							text: 'Show the assigned and the line items without assignment',
						},
						iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
						id: 'filterBoQAndNotAssigned',
						isDisplayed: true,
						type: ItemType.Radio,
					},
					{
						caption: {
							key: 'cloud.common.filterNotAssigned',
							text: 'Show only line items without assignment',
						},
						iconClass: 'tlb-icons ico-filter-notassigned',
						id: 'filterNotAssigned',
						isDisplayed: true,
						type: ItemType.Radio,
					},
				],
			},
			isSet: true,
		},
		{
			caption: {
				text: 'Estimate Configuration Dialog',
				key: 'Estimate Configuration Dialog',
			},
			cssClass: 'tlb-icons ico-settings-doc',
			hideItem: false,
			iconClass: 'tlb-icons ico-settings-doc',
			id: 'modalConfig',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				text: 'radio group caption',
				key: 'radio group caption',
			},
			groupId: 'dropdown-btn-radio2',
			hideItem: false,
			iconClass: 'tlb-icons ico-watchlist-add',
			id: 'radio2',
			layoutChangeable: true,
			layoutModes: 'vertical',
			type: ItemType.DropdownBtn,
			list: {
				activeValue: 't-addtowatchlist',
				cssClass: 'radio-group',
				showTitles: true,
				items: [
					{
						caption: {
							key: 'cloud.common.addWawatchlist',
						},
						iconClass: 'tlb-icons ico-watchlist-add',
						id: 't-addtowatchlist',
						sort: 110,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.bulkEditor.title',
						},
						hideItem: false,
						iconClass: 'type-icons ico-construction51',
						id: 't1444',
						sort: 140,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.taskBarColumnFilter',
						},
						hideItem: false,
						iconClass: 'tlb-icons ico-search-column',
						id: 'gridSearchColumn',
						sort: 160,
						type: ItemType.Check,
					},
				],
			},
			isSet: true,
		},
		{
			caption: {
				text: 'Copy Line Item',
				key: 'Copy Line Item',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-copy-line-item',
			id: 'copyasbase',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				text: 'Create Reference Line Item',
				key: 'Create Reference Line Item',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-copy-line-item-ref',
			id: 'copyasreference',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.taskBarColumnFilter',
				text: 'Column Filter',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-search-column',
			id: 'gridSearchColumn',
			sort: 160,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.gridSettings',
				text: 'Grid Settings',
			},
			iconClass: 'tlb-icons ico-settings',
			isSet: true,
			cssClass: 'tlb-icons ico-settings',
			groupId: 'dropdown-btn-t205',
			hideItem: false,
			id: 't205',
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [
					{
						id: 't111',
						sort: 112,
						caption: {
							key: 'cloud.common.gridlayout',
						},
						type: ItemType.Item,
					},
					{
						id: 't155',
						sort: 200,
						caption: {
							key: 'cloud.common.showStatusbar',
						},
						type: ItemType.Check,
						value: true,
					},
					{
						id: 't255',
						sort: 200,
						caption: {
							key: 'cloud.common.markReadonlyCells',
						},
						type: ItemType.Check,
						value: true,
					},
				],
			},
			sort: 200,
			type: ItemType.DropdownBtn,
		},
		{
			caption: {
				key: 'cloud.common.viewerConfiguration',
				text: 'Viewer Configuration',
			},
			iconClass: 'ico-menu',
			cssClass: 'fix',
			id: 'fixbutton',
			isDisplayed: false,
			type: ItemType.OverflowBtn,
			hideItem: true,
			list: {
				cssClass: ' dropdown-menu-right ',
				showImages: true,
				showTitles: true,
				items: [
					{
						caption: {
							text: 'wizards',
						},
						iconClass: 'tlb-icons ico-delete',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 8,
						},
						isSet: true,
						hideItem: true,
						id: 't200',
						sort: 300,
						type: ItemType.Item,
					},
					{
						id: 'd0',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarNewRecord',
						},
						iconClass: 'tlb-icons ico-rec-new',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 4,
						},
						disabled: true,
						hideItem: true,
						id: 'create',
						sort: 0,
						type: ItemType.Item,
						isSet: true,
					},
					{
						id: 'd0',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarDeleteRecord',
						},
						iconClass: 'tlb-icons ico-rec-delete',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 8,
						},
						disabled: true,
						hideItem: true,
						id: 'delete',
						sort: 10,
						type: ItemType.Item,
						isSet: true,
					},
					{
						id: 'd1',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarGrouping',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-group-columns',
						id: 't12',
						sort: 10,
						type: ItemType.Check,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.filterByViewer',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-filter-by-model',
						id: 'toggleFilteringSelection',
						sort: 20,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							text: 'Pin Selected Item',
						},
						cssClass: 'active',
						hideItem: true,
						iconClass: 'tlb-icons ico-set-prj-context',
						id: 't-pinningctx',
						sort: 120,
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.bulkEditor.title',
						},
						hideItem: true,
						iconClass: 'type-icons ico-construction51',
						id: 't14',
						sort: 140,
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarSearch',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-search-all',
						id: 'gridSearchAll',
						sort: 150,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.exportClipboard',
						},
						cssClass: 'tlb-icons ico-clipboard ',
						groupId: 'dropdown-btn-t199',
						hideItem: true,
						iconClass: 'tlb-icons ico-clipboard',
						id: 't199',
						sort: 199,
						type: ItemType.DropdownBtn,
						list: {
							cssClass: 'dropdown-menu-right',
							showImages: false,
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.exportArea',
									},
									id: 't100',
									sort: 100,
									type: ItemType.Check,
									value: false,
								},
								{
									caption: {
										key: 'cloud.common.exportCopy',
									},
									id: 't200',
									sort: 200,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.exportPaste',
									},
									id: 't300',
									sort: 300,
									type: ItemType.Item,
								},
								{
									id: 'dCopyPaste',
									sort: 400,
									type: ItemType.Divider,
								},
								{
									caption: {
										key: 'cloud.common.exportWithHeader',
									},
									id: 't400',
									sort: 500,
									type: ItemType.Check,
								},
							],
						},
						isSet: true,
					},
					{
						caption: 'radio group caption',
						groupId: 'sublist-group_manupulation_operator',
						hideItem: true,
						iconClass: 'filterBoQ',
						id: 'group_manupulation_operator',
						layoutChangeable: true,
						layoutModes: 'horizontal',
						type: ItemType.Sublist,
						list: {
							activeValue: 'filterBoQ',
							cssClass: 'radio-group dropdown-menu-right',
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.filterAssigned',
									},
									iconClass: 'tlb-icons ico-filter-assigned ',
									id: 'filterBoQ',
									isDisplayed: true,
									type: ItemType.Radio,
								},
								{
									caption: {
										key: 'cloud.common.filterAssignedAndNotAssigned',
									},
									iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
									id: 'filterBoQAndNotAssigned',
									isDisplayed: true,
									type: ItemType.Radio,
								},
								{
									caption: {
										key: 'cloud.common.filterNotAssigned',
									},
									iconClass: 'tlb-icons ico-filter-notassigned',
									id: 'filterNotAssigned',
									isDisplayed: true,
									type: ItemType.Radio,
								},
							],
						},
						isSet: true,
					},
					{
						caption: {
							text: 'Estimate Configuration Dialog',
						},
						cssClass: 'tlb-icons ico-settings-doc',
						hideItem: true,
						iconClass: 'tlb-icons ico-settings-doc',
						id: 'modalConfig',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							text: 'radio group caption',
						},
						groupId: 'dropdown-btn-radio2',
						hideItem: true,
						iconClass: 'tlb-icons ico-watchlist-add',
						id: 'radio2',
						layoutChangeable: true,
						layoutModes: 'vertical',
						type: ItemType.DropdownBtn,
						list: {
							activeValue: 't-addtowatchlist',
							cssClass: 'radio-group',
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.addWawatchlist',
									},
									iconClass: 'tlb-icons ico-watchlist-add',
									id: 't-addtowatchlist',
									sort: 110,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.bulkEditor.title',
									},
									hideItem: false,
									iconClass: 'type-icons ico-construction51',
									id: 't1444',
									sort: 140,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.taskBarColumnFilter',
									},
									hideItem: false,
									iconClass: 'tlb-icons ico-search-column',
									id: 'gridSearchColumn',
									sort: 160,
									type: ItemType.Check,
								},
							],
						},
						isSet: true,
					},
					{
						caption: {
							text: 'Copy Line Item',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-copy-line-item',
						id: 'copyasbase',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							text: 'Create Reference Line Item',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-copy-line-item-ref',
						id: 'copyasreference',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarColumnFilter',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-search-column',
						id: 'gridSearchColumn',
						sort: 160,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.gridSettings',
						},
						iconClass: 'tlb-icons ico-settings',
						isSet: true,
						cssClass: 'tlb-icons ico-settings',
						groupId: 'dropdown-btn-t200',
						hideItem: true,
						id: 't205',
						list: {
							showImages: false,
							showTitles: true,
							cssClass: 'dropdown-menu-right',
							items: [
								{
									id: 't111',
									sort: 112,
									caption: {
										key: 'cloud.common.gridlayout',
									},
									type: ItemType.Item,
								},
								{
									id: 't155',
									sort: 200,
									caption: {
										key: 'cloud.common.showStatusbar',
									},
									type: ItemType.Check,
									value: true,
								},
								{
									id: 't255',
									sort: 200,
									caption: {
										key: 'cloud.common.markReadonlyCells',
									},
									type: ItemType.Check,
									value: true,
								},
							],
						},
						sort: 200,
						type: ItemType.DropdownBtn,
					},
				],
			},
			groupId: 'overflow-btn-fixbutton',
		},
	],
	showImages: true,
	showTitles: false,
	overflow: true,
	iconClass: '',
	layoutChangeable: false
};

/**
 * mockdata for menulist 
 */
export const menuItems: ConcreteMenuItem[] = [
	{
		id: 't200',
		caption: { text: 'wizards' },
		sort: 300,
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-delete',
		permission: '681223e37d524ce0b9bfa2294e18d650',

		fn: () => {
			throw new Error('This method is not implemented');
		},
		hideItem: false,
	},
	{
		id: 'd0',
		type: ItemType.Divider,
		hideItem: false,
	},

	{
		id: 'create',
		sort: 0,
		caption: { key: 'cloud.common.taskBarNewRecord' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-rec-new',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {
			throw new Error('This method is not implemented');
		},
		hideItem: false,
	},
	{
		id: 't199',
		caption: { key: 'cloud.common.exportClipboard' },
		sort: 199,
		type: ItemType.DropdownBtn,
		cssClass: 'tlb-icons ico-clipboard',
		list: {
			showImages: false,
			showTitles: true,
			cssClass: 'dropdown-menu-right',
			items: [
				{
					id: 't100',
					sort: 100,
					type: ItemType.Check,
					caption: { key: 'cloud.common.exportArea' },
					value: false,
				},
				{
					id: 't200',
					sort: 200,
					caption: { key: 'cloud.common.exportCopy' },
					type: ItemType.Item,
				},
				{
					id: 't300',
					sort: 300,
					caption: { key: 'cloud.common.exportPaste' },
					type: ItemType.Item,
				},
				{
					id: 'dCopyPaste',
					sort: 400,
					type: ItemType.Divider,
				},
				{
					id: 't400',
					sort: 500,
					caption: { key: 'cloud.common.exportWithHeader' },
					type: ItemType.Check,
				},
			],
		},
		iconClass: 'tlb-icons ico-clipboard',

		hideItem: false,
	},
	{
		caption: { text: 'radio group caption' },
		type: ItemType.Sublist,
		iconClass: 'filterBoQ',
		list: {
			cssClass: 'radio-group overflow',
			activeValue: 'filterBoQ',
			showTitles: true,
			items: [
				{
					id: 'filterBoQ',
					caption: { key: 'estimate.main.filterAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned',
					isDisplayed: true,
					fn: () => {
						throw new Error('This method is not implemented');
					},
				},
				{
					id: 'filterBoQAndNotAssigned',
					caption: { key: 'estimate.main.filterAssignedAndNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
					isDisplayed: true,
				},
				{
					id: 'filterNotAssigned',
					caption: { key: 'estimate.main.filterNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-notassigned',
					isDisplayed: true,
				},
			],
		},
		hideItem: false,
	},
	{
		id: 'd1',
		type: ItemType.Divider,
		hideItem: false,
	},
	{
		id: 't199',
		caption: { key: 'cloud.common.exportClipboard' },
		sort: 199,
		type: ItemType.DropdownBtn,
		cssClass: 'tlb-icons ico-clipboard',
		list: {
			showImages: false,
			showTitles: true,
			cssClass: 'dropdown-menu-right',
			items: [
				{
					id: 't100',
					sort: 100,
					type: ItemType.Check,
					caption: { key: 'cloud.common.exportArea' },
					value: false,
				},
				{
					id: 't200',
					sort: 200,
					caption: { key: 'cloud.common.exportCopy' },
					type: ItemType.Item,
				},
				{
					id: 't300',
					sort: 300,
					caption: { key: 'cloud.common.exportPaste' },
					type: ItemType.Item,
				},
				{
					id: 'dCopyPaste',
					sort: 400,
					type: ItemType.Divider,
				},
				{
					id: 't400',
					sort: 500,
					caption: { key: 'cloud.common.exportWithHeader' },
					type: ItemType.Check,
				},
			],
		},
		iconClass: 'tlb-icons ico-clipboard',

		hideItem: false,
	},
	{
		id: 'd1',
		hideItem: false,
	},
	{
		id: 'd2',
		type: ItemType.OverflowBtn,
		hideItem: false,
		list: {}
	},
	{
		id: 'd3',
		type: undefined,
		hideItem: false,
	},
];

/**
 * sample menulist 
 */
export const mockMenuList={
	isVisible: true,
	cssClass: 'tools ',
	items: [
		{
			caption: {
				text: 'wizards',
				key: 'wizards',
			},
			iconClass: 'tlb-icons ico-delete',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 8,
			},
			isSet: true,
			hideItem: false,
			id: 't200',
			sort: 300,
			type: ItemType.Item,
		},
		{
			id: 'd0',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarNewRecord',
				text: 'New Record',
			},
			iconClass: 'tlb-icons ico-rec-new',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 4,
			},
			disabled: true,
			hideItem: false,
			id: 'create',
			sort: 0,
			type: ItemType.Item,
			isSet: true,
		},
		{
			id: 'd0',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarDeleteRecord',
				text: 'Delete Record',
			},
			iconClass: 'tlb-icons ico-rec-delete',
			permission: {
				f01193df20e34b8d917250ad17a433f1: 8,
			},
			disabled: true,
			hideItem: false,
			id: 'delete',
			sort: 10,
			type: ItemType.Item,
			isSet: true,
		},
		{
			id: 'd1',
			type: ItemType.Divider,
			isSet: true,
			hideItem: false,
		},
		{
			caption: {
				key: 'cloud.common.taskBarGrouping',
				text: 'Grouping',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-group-columns',
			id: 't12',
			sort: 10,
			type: ItemType.Check,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.filterByViewer',
				text: 'Filter by Model Object Selection',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-filter-by-model',
			id: 'toggleFilteringSelection',
			sort: 20,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				text: 'Pin Selected Item',
				key: 'Pin Selected Item',
			},
			cssClass: 'active',
			hideItem: false,
			iconClass: 'tlb-icons ico-set-prj-context',
			id: 't-pinningctx',
			sort: 120,
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.bulkEditor.title',
				text: 'Bulk Editor',
			},
			hideItem: false,
			iconClass: 'type-icons ico-construction51',
			id: 't14',
			sort: 140,
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.taskBarSearch',
				text: 'Search',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-search-all',
			id: 'gridSearchAll',
			sort: 150,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.exportClipboard',
				text: 'Clipboard',
			},
			cssClass: 'tlb-icons ico-clipboard ',
			groupId: 'dropdown-btn-t199',
			hideItem: false,
			iconClass: 'tlb-icons ico-clipboard',
			id: 't199',
			sort: 199,
			type: ItemType.DropdownBtn,
			list: {
				cssClass: 'dropdown-menu-right',
				showImages: false,
				showTitles: true,
				items: [
					{
						caption: {
							key: 'cloud.common.exportArea',
						},
						id: 't100',
						sort: 100,
						type: ItemType.Check,
						value: false,
					},
					{
						caption: {
							key: 'cloud.common.exportCopy',
						},
						id: 't200',
						sort: 200,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.exportPaste',
						},
						id: 't300',
						sort: 300,
						type: ItemType.Item,
					},
					{
						id: 'dCopyPaste',
						sort: 400,
						type: ItemType.Divider,
					},
					{
						caption: {
							key: 'cloud.common.exportWithHeader',
						},
						id: 't400',
						sort: 500,
						type: ItemType.Check,
					},
				],
			},
			isSet: true,
		},
		{
			caption: 'radio group caption',
			groupId: 'sublist-group_manupulation_operator',
			hideItem: false,
			iconClass: 'filterBoQ',
			id: 'group_manupulation_operator',
			layoutChangeable: true,
			layoutModes: 'horizontal',
			type: ItemType.Sublist,
			list: {
				activeValue: 'filterBoQ',
				cssClass: 'radio-group dropdown-menu-right',
				showTitles: false,
				items: [
					{
						caption: {
							key: 'cloud.common.filterAssigned',
							text: 'Show only the assigned line items of the current selection',
						},
						iconClass: 'tlb-icons ico-filter-assigned ',
						id: 'filterBoQ',
						isDisplayed: true,
						type: ItemType.Radio,
					},
					{
						caption: {
							key: 'cloud.common.filterAssignedAndNotAssigned',
							text: 'Show the assigned and the line items without assignment',
						},
						iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
						id: 'filterBoQAndNotAssigned',
						isDisplayed: true,
						type: ItemType.Radio,
					},
					{
						caption: {
							key: 'cloud.common.filterNotAssigned',
							text: 'Show only line items without assignment',
						},
						iconClass: 'tlb-icons ico-filter-notassigned',
						id: 'filterNotAssigned',
						isDisplayed: true,
						type: ItemType.Radio,
					},
				],
			},
			isSet: true,
		},
		{
			caption: {
				text: 'Estimate Configuration Dialog',
				key: 'Estimate Configuration Dialog',
			},
			cssClass: 'tlb-icons ico-settings-doc',
			hideItem: false,
			iconClass: 'tlb-icons ico-settings-doc',
			id: 'modalConfig',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				text: 'radio group caption',
				key: 'radio group caption',
			},
			groupId: 'dropdown-btn-radio2',
			hideItem: false,
			iconClass: 'tlb-icons ico-watchlist-add',
			id: 'radio2',
			layoutChangeable: true,
			layoutModes: 'vertical',
			type: ItemType.DropdownBtn,
			list: {
				activeValue: 't-addtowatchlist',
				cssClass: 'radio-group',
				showTitles: true,
				items: [
					{
						caption: {
							key: 'cloud.common.addWawatchlist',
						},
						iconClass: 'tlb-icons ico-watchlist-add',
						id: 't-addtowatchlist',
						sort: 110,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.bulkEditor.title',
						},
						hideItem: false,
						iconClass: 'type-icons ico-construction51',
						id: 't1444',
						sort: 140,
						type: ItemType.Item,
					},
					{
						caption: {
							key: 'cloud.common.taskBarColumnFilter',
						},
						hideItem: false,
						iconClass: 'tlb-icons ico-search-column',
						id: 'gridSearchColumn',
						sort: 160,
						type: ItemType.Check,
					},
				],
			},
			isSet: true,
		},
		{
			caption: {
				text: 'Copy Line Item',
				key: 'Copy Line Item',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-copy-line-item',
			id: 'copyasbase',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				text: 'Create Reference Line Item',
				key: 'Create Reference Line Item',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-copy-line-item-ref',
			id: 'copyasreference',
			type: ItemType.Item,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.taskBarColumnFilter',
				text: 'Column Filter',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-search-column',
			id: 'gridSearchColumn',
			sort: 160,
			type: ItemType.Check,
			value: false,
			isSet: true,
		},
		{
			caption: {
				key: 'cloud.common.gridSettings',
				text: 'Grid Settings',
			},
			iconClass: 'tlb-icons ico-settings',
			isSet: true,
			cssClass: 'tlb-icons ico-settings',
			groupId: 'dropdown-btn-t205',
			hideItem: false,
			id: 't205',
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [
					{
						id: 't111',
						sort: 112,
						caption: {
							key: 'cloud.common.gridlayout',
						},
						type: ItemType.Item,
					},
					{
						id: 't155',
						sort: 200,
						caption: {
							key: 'cloud.common.showStatusbar',
						},
						type: ItemType.Check,
						value: true,
					},
					{
						id: 't255',
						sort: 200,
						caption: {
							key: 'cloud.common.markReadonlyCells',
						},
						type: ItemType.Check,
						value: true,
					},
				],
			},
			sort: 200,
			type: ItemType.DropdownBtn,
		},
		{
			caption: {
				key: 'cloud.common.viewerConfiguration',
				text: 'Viewer Configuration',
			},
			iconClass: 'ico-menu',
			cssClass: 'fix',
			id: 'fixbutton',
			isDisplayed: false,
			type: ItemType.OverflowBtn,
			hideItem: true,
			list: {
				cssClass: ' dropdown-menu-right ',
				showImages: true,
				showTitles: true,
				items: [
					{
						caption: {
							text: 'wizards',
						},
						iconClass: 'tlb-icons ico-delete',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 8,
						},
						isSet: true,
						hideItem: true,
						id: 't200',
						sort: 300,
						type: ItemType.Item,
					},
					{
						id: 'd0',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarNewRecord',
						},
						iconClass: 'tlb-icons ico-rec-new',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 4,
						},
						disabled: true,
						hideItem: true,
						id: 'create',
						sort: 0,
						type: ItemType.Item,
						isSet: true,
					},
					{
						id: 'd0',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarDeleteRecord',
						},
						iconClass: 'tlb-icons ico-rec-delete',
						permission: {
							f01193df20e34b8d917250ad17a433f1: 8,
						},
						disabled: true,
						hideItem: true,
						id: 'delete',
						sort: 10,
						type: ItemType.Item,
						isSet: true,
					},
					{
						id: 'd1',
						type: ItemType.Divider,
						isSet: true,
						hideItem: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarGrouping',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-group-columns',
						id: 't12',
						sort: 10,
						type: ItemType.Check,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.filterByViewer',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-filter-by-model',
						id: 'toggleFilteringSelection',
						sort: 20,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							text: 'Pin Selected Item',
						},
						cssClass: 'active',
						hideItem: true,
						iconClass: 'tlb-icons ico-set-prj-context',
						id: 't-pinningctx',
						sort: 120,
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.bulkEditor.title',
						},
						hideItem: true,
						iconClass: 'type-icons ico-construction51',
						id: 't14',
						sort: 140,
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarSearch',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-search-all',
						id: 'gridSearchAll',
						sort: 150,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.exportClipboard',
						},
						cssClass: 'tlb-icons ico-clipboard ',
						groupId: 'dropdown-btn-t199',
						hideItem: true,
						iconClass: 'tlb-icons ico-clipboard',
						id: 't199',
						sort: 199,
						type: ItemType.DropdownBtn,
						list: {
							cssClass: 'dropdown-menu-right',
							showImages: false,
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.exportArea',
									},
									id: 't100',
									sort: 100,
									type: ItemType.Check,
									value: false,
								},
								{
									caption: {
										key: 'cloud.common.exportCopy',
									},
									id: 't200',
									sort: 200,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.exportPaste',
									},
									id: 't300',
									sort: 300,
									type: ItemType.Item,
								},
								{
									id: 'dCopyPaste',
									sort: 400,
									type: ItemType.Divider,
								},
								{
									caption: {
										key: 'cloud.common.exportWithHeader',
									},
									id: 't400',
									sort: 500,
									type: ItemType.Check,
								},
							],
						},
						isSet: true,
					},
					{
						caption: 'radio group caption',
						groupId: 'sublist-group_manupulation_operator',
						hideItem: true,
						iconClass: 'filterBoQ',
						id: 'group_manupulation_operator',
						layoutChangeable: true,
						layoutModes: 'horizontal',
						type: ItemType.Sublist,
						list: {
							activeValue: 'filterBoQ',
							cssClass: 'radio-group dropdown-menu-right',
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.filterAssigned',
									},
									iconClass: 'tlb-icons ico-filter-assigned ',
									id: 'filterBoQ',
									isDisplayed: true,
									type: ItemType.Radio,
								},
								{
									caption: {
										key: 'cloud.common.filterAssignedAndNotAssigned',
									},
									iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
									id: 'filterBoQAndNotAssigned',
									isDisplayed: true,
									type: ItemType.Radio,
								},
								{
									caption: {
										key: 'cloud.common.filterNotAssigned',
									},
									iconClass: 'tlb-icons ico-filter-notassigned',
									id: 'filterNotAssigned',
									isDisplayed: true,
									type: ItemType.Radio,
								},
							],
						},
						isSet: true,
					},
					{
						caption: {
							text: 'Estimate Configuration Dialog',
						},
						cssClass: 'tlb-icons ico-settings-doc',
						hideItem: true,
						iconClass: 'tlb-icons ico-settings-doc',
						id: 'modalConfig',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							text: 'radio group caption',
						},
						groupId: 'dropdown-btn-radio2',
						hideItem: true,
						iconClass: 'tlb-icons ico-watchlist-add',
						id: 'radio2',
						layoutChangeable: true,
						layoutModes: 'vertical',
						type: ItemType.DropdownBtn,
						list: {
							activeValue: 't-addtowatchlist',
							cssClass: 'radio-group',
							showTitles: true,
							items: [
								{
									caption: {
										key: 'cloud.common.addWawatchlist',
									},
									iconClass: 'tlb-icons ico-watchlist-add',
									id: 't-addtowatchlist',
									sort: 110,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.bulkEditor.title',
									},
									hideItem: false,
									iconClass: 'type-icons ico-construction51',
									id: 't1444',
									sort: 140,
									type: ItemType.Item,
								},
								{
									caption: {
										key: 'cloud.common.taskBarColumnFilter',
									},
									hideItem: false,
									iconClass: 'tlb-icons ico-search-column',
									id: 'gridSearchColumn',
									sort: 160,
									type: ItemType.Check,
								},
							],
						},
						isSet: true,
					},
					{
						caption: {
							text: 'Copy Line Item',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-copy-line-item',
						id: 'copyasbase',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							text: 'Create Reference Line Item',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-copy-line-item-ref',
						id: 'copyasreference',
						type: ItemType.Item,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.taskBarColumnFilter',
						},
						hideItem: true,
						iconClass: 'tlb-icons ico-search-column',
						id: 'gridSearchColumn',
						sort: 160,
						type: ItemType.Check,
						value: false,
						isSet: true,
					},
					{
						caption: {
							key: 'cloud.common.gridSettings',
						},
						iconClass: 'tlb-icons ico-settings',
						isSet: true,
						cssClass: 'tlb-icons ico-settings',
						groupId: 'dropdown-btn-t200',
						hideItem: true,
						id: 't205',
						list: {
							showImages: false,
							showTitles: true,
							cssClass: 'dropdown-menu-right',
							items: [
								{
									id: 't111',
									sort: 112,
									caption: {
										key: 'cloud.common.gridlayout',
									},
									type: ItemType.Item,
								},
								{
									id: 't155',
									sort: 200,
									caption: {
										key: 'cloud.common.showStatusbar',
									},
									type: ItemType.Check,
									value: true,
								},
								{
									id: 't255',
									sort: 200,
									caption: {
										key: 'cloud.common.markReadonlyCells',
									},
									type: ItemType.Check,
									value: true,
								},
							],
						},
						sort: 200,
						type: ItemType.DropdownBtn,
					},
				],
			},
			groupId: 'overflow-btn-fixbutton',
		},
	],
	showImages: true,
	showTitles: false,
	overflow: true,
	iconClass: '',
	layoutChangeable: false,
	uuid: 'f01193df20e34b8d917250ad17a433f1',
};