/*
 * Copyright(c) RIB Software GmbH
 */

import { ItemType } from '../model/menu-list/enum/menulist-item-type.enum';
import { ConcreteMenuItem } from '../model/menu-list/interface/index';

export const tools: ConcreteMenuItem[] = [
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
		fn: () => {},
		
		hideItem: false,
	},
	{
		id: 'd0',
		type: ItemType.Divider,
		hideItem: false,
	},
	{
		id: 'delete',
		sort: 10,
		caption: { key: 'cloud.common.taskBarDeleteRecord' },
		type: ItemType.Item,
		cssClass: 'tlb-icons ico-rec-delete',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'd1',

		type: ItemType.Divider,

		hideItem: false,
	},
	{
		id: 't12',
		sort: 10,
		caption: { key: 'cloud.common.taskBarGrouping' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-group-columns',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'toggleFilteringSelection',
		sort: 20,
		caption: { key: 'cloud.common.filterByViewer' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-filter-by-model',
		value: false,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't108',
		sort: 108,
		caption: { key: 'cloud.common.print' },
		iconClass: 'tlb-icons ico-print-preview',
		type: ItemType.Item,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't-pinningctx',
		type: ItemType.Item,
		caption: { text: 'Pin Selected Item' },
		iconClass: 'tlb-icons ico-set-prj-context',
		sort: 120,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't14',
		sort: 140,
		caption: { key: 'cloud.common.bulkEditor.title' },
		type: ItemType.Item,
		iconClass: 'type-icons ico-construction51',
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'gridSearchAll',
		sort: 150,
		caption: { key: 'cloud.common.taskBarSearch' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-search-all',

		value: false,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'gridSearchColumn',
		sort: 160,
		caption: { key: 'cloud.common.taskBarColumnFilter' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-search-column',
		cssClass: 'sample',
		value: false,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't199',
		caption: { key: 'cloud.common.exportClipboard' },
		sort: 199,
		type: ItemType.DropdownBtn,
		groupId: 'dropdown-btn-t199',
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
					fn: () => {},
					value: false,
				},
				{
					id: 't200',
					sort: 200,
					caption: { key: 'cloud.common.exportCopy' },
					fn: () => {},
					type: ItemType.Item,
				},
				{
					id: 't300',
					sort: 300,
					caption: { key: 'cloud.common.exportPaste' },
					fn: () => {},
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
					fn: () => {},
					type: ItemType.Check,
				},
			],
		},
		iconClass: 'tlb-icons ico-clipboard',

		hideItem: false,
	},
	{
		id: 'group_manupulation_operator',
		caption: 'radio group caption',
		type: ItemType.Sublist,
		layoutModes: 'horizontal',
		iconClass: 'filterBoQ',
		layoutChangeable: true,
		list: {
			cssClass: 'radio-group',
			activeValue: 'filterBoQ',
			showTitles: false,
			items: [
				{
					id: 'filterBoQ',
					caption: { key: 'cloud.common.filterAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned',
					isDisplayed: true,
					fn: () => {},
				},
				{
					id: 'filterBoQAndNotAssigned',
					caption: { key: 'cloud.common.filterAssignedAndNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
					isDisplayed: true,
					fn: () => {},
				},
				{
					id: 'filterNotAssigned',
					caption: { key: 'cloud.common.filterNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-notassigned',
					isDisplayed: true,
					fn: () => {},
				},
			],
		},

		hideItem: false,
	},
	{
		id: 'modalConfig',
		caption: { text: 'Estimate Configuration Dialog' },
		type: ItemType.Item,
		cssClass: 'tlb-icons ico-settings-doc',
		iconClass: 'tlb-icons ico-settings-doc',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'radio2',
		caption: { text: 'radio group caption' },
		type: ItemType.DropdownBtn,
		layoutModes: 'vertical',
		iconClass: 'tlb-icons ico-watchlist-add',
		layoutChangeable: true,
		list: {
			cssClass: 'radio-group',
			activeValue: 't-addtowatchlist',
			showTitles: true,
			items: [
				{
					id: 't-addtowatchlist',
					type: ItemType.Item,
					caption: { key: 'cloud.common.addWawatchlist' },
					iconClass: 'tlb-icons ico-watchlist-add',
					sort: 110,

					fn: () => {},
				},
				{
					id: 't1444',
					caption: { key: 'cloud.common.bulkEditor.title' },
					type: ItemType.Item,
					iconClass: 'type-icons ico-construction51',
					sort: 140,
					hideItem: false,
					permission: '681223e37d524ce0b9bfa2294e18d650',

					fn: () => {},
				},
				{
					id: 'gridSearchColumn',
					caption: { key: 'cloud.common.taskBarColumnFilter' },
					type: ItemType.Check,
					sort: 160,
					iconClass: 'tlb-icons ico-search-column',
					hideItem: false,
					fn: () => {},
				},
			],
		},

		hideItem: false,
	},
	{
		id: 'copyasbase',
		caption: { text: 'Copy Line Item' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-copy-line-item',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'copyasreference',
		caption: { text: 'Create Reference Line Item' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-copy-line-item-ref',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't200',
		caption: { key: 'cloud.common.gridSettings' },
		sort: 200,
		type: ItemType.DropdownBtn,
		cssClass: 'tlb-icons ico-settings',
		list: {
			showImages: false,
			showTitles: true,
			cssClass: 'dropdown-menu-right',
			items: [
				{
					id: 't111',
					sort: 112,
					caption: { key: 'cloud.common.gridlayout' },
					permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',
					type: ItemType.Item,
				},
				{
					id: 't155',
					sort: 200,
					caption: { key: 'cloud.common.showStatusbar' },
					type: ItemType.Check,
					value: true,
				},
				{
					id: 't255',
					sort: 200,
					caption: { key: 'cloud.common.markReadonlyCells' },
					type: ItemType.Check,
					value: true,
				},
			],
		},
		iconClass: 'tlb-icons ico-settings',

		hideItem: false,
	},

	{
		type: ItemType.OverflowBtn,
		id: 'fixbutton',
		isDisplayed: true,
		cssClass: ' fix ',
		iconClass: 'ico-menu',
		caption: { key: 'cloud.common.viewerConfiguration' },
		list: {
			items: [
				{
					id: 't200',
					caption: { text: 'wizards' },
					sort: 300,
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-delete',
					permission: '681223e37d524ce0b9bfa2294e18d650',

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

					hideItem: false,
				},
				{
					id: 'd0',
					type: ItemType.Divider,

					hideItem: false,
				},
				{
					id: 'delete',
					sort: 10,
					caption: { key: 'cloud.common.taskBarDeleteRecord' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: true,
					permission: '681223e37d524ce0b9bfa2294e18d650',

					hideItem: false,
				},
				{
					id: 'd1',

					type: ItemType.Divider,

					hideItem: false,
				},
				{
					id: 't12',
					sort: 10,
					caption: { key: 'cloud.common.taskBarGrouping' },
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-group-columns',

					hideItem: false,
				},
				{
					id: 'toggleFilteringSelection',
					sort: 20,
					caption: { key: 'cloud.common.filterByViewer' },
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-filter-by-model',
					value: false,

					hideItem: false,
				},
				{
					id: 't108',
					sort: 108,
					caption: { key: 'cloud.common.print' },
					iconClass: 'tlb-icons ico-print-preview',
					type: ItemType.Item,

					hideItem: false,
				},
				{
					id: 't-pinningctx',
					type: ItemType.Item,
					caption: { text: 'Pin Selected Item' },
					iconClass: 'tlb-icons ico-set-prj-context',
					sort: 120,

					hideItem: false,
				},
				{
					id: 't14',
					sort: 140,
					caption: { key: 'cloud.common.bulkEditor.title' },
					type: ItemType.Item,
					iconClass: 'type-icons ico-construction51',
					permission: '681223e37d524ce0b9bfa2294e18d650',

					hideItem: false,
				},
				{
					id: 'gridSearchAll',
					sort: 150,
					caption: { key: 'cloud.common.taskBarSearch' },
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-search-all',

					value: false,

					hideItem: false,
				},
				{
					id: 'gridSearchColumn',
					sort: 160,
					caption: { key: 'cloud.common.taskBarColumnFilter' },
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-search-column',

					value: false,

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
					iconClass: 'filterCollection',
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						items: [],
					},

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
								fn: () => {},
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
					id: 'modalConfig',
					caption: { key: 'Estimate Configuration Dialog' },
					type: ItemType.Item,
					cssClass: 'tlb-icons ico-settings-doc',
					iconClass: 'tlb-icons ico-settings-doc',

					hideItem: false,
				},
				{
					id: 'copyasbase',
					caption: { text: 'Copy Line Item' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-copy-line-item',

					hideItem: false,
				},
				{
					id: 'copyasreference',
					caption: { text: 'Create Reference Line Item' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-copy-line-item-ref',
					hideItem: false,
				},
				{
					id: 't201',
					caption: { key: 'cloud.common.gridSettings' },
					sort: 200,
					type: ItemType.DropdownBtn,

					cssClass: 'tlb-icons ico-settings',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 't111',
								sort: 112,
								caption: { key: 'cloud.common.gridlayout' },
								permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',

								type: ItemType.Item,
							},
							{
								id: 't155',
								sort: 200,
								caption: { key: 'cloud.common.showStatusbar' },
								type: ItemType.Check,
								value: true,
							},
							{
								id: 't255',
								sort: 200,
								caption: { key: 'cloud.common.markReadonlyCells' },
								type: ItemType.Check,
								value: true,
							},
						],
					},
					iconClass: 'tlb-icons ico-settings',

					hideItem: false,
				},
			],
			overflow: true,

			showImages: true,
			showTitles: true,
		},
	},
	{
		id: 't200',
		caption: { text: 'wizards' },
		sort: 300,
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-delete',
		permission: '681223e37d524ce0b9bfa2294e18d650',

		fn: () => {},
		hideItem: false,
	},
	{
		id: 'cfgGroup',
		type: ItemType.Sublist,
		caption: { key: 'cloud.common.viewerConfiguration' },
		sort: 400,
		list: {
			showTitles: false,
			items: [
				{
					id: 'Cfg',
					caption: { key: 'cloud.common.viewerConfiguration' },
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-container-config',
					isDisplayed: true,
					fn: () => {},
				},
			],

			cssClass: '',
			activeValue: '',
		},
		isDisplayed: true,
		hideItem: false,
	},
];

export const groups: ConcreteMenuItem[] = [
	{
		id: 'group_manupulation_operator',
		caption: 'radio group caption',
		type: ItemType.Sublist,
		layoutModes: 'horizontal',
		iconClass: 'filterBoQ',
		layoutChangeable: true,
		list: {
			cssClass: 'radio-group',
			activeValue: 'filterBoQ',
			showTitles: false,
			items: [
				{
					id: 'filterBoQ',
					caption: { key: 'cloud.common.filterAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned',
					isDisplayed: true,
					fn: () => {},
				},
				{
					id: 'filterBoQAndNotAssigned',
					caption: { key: 'cloud.common.filterAssignedAndNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
					isDisplayed: true,
					fn: () => {},
				},
				{
					id: 'filterNotAssigned',
					caption: { key: 'cloud.common.filterNotAssigned' },
					type: ItemType.Radio,
					iconClass: 'tlb-icons ico-filter-notassigned',
					isDisplayed: true,
					fn: () => {},
				},
			],
		},

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
					fn: () => {},
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
];

export const toolsSort: ConcreteMenuItem[] = [
	{
		id: 'create',
		sort: 50,
		caption: { key: 'cloud.common.taskBarNewRecord' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-rec-new',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},

	{
		id: 'delete',
		sort: 50,

		caption: { key: 'cloud.common.taskBarDeleteRecord' },
		type: ItemType.Item,
		cssClass: 'tlb-icons ico-rec-delete',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},

	{
		id: 't12',
		sort: 50,

		caption: { key: 'cloud.common.taskBarGrouping' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-group-columns',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'toggleFilteringSelection',
		sort: 50,

		caption: { key: 'cloud.common.filterByViewer' },
		type: ItemType.Check,
		iconClass: 'tlb-icons ico-filter-by-model',
		value: false,
		fn: () => {},
		hideItem: false,
	},
	{
		id: 't108',
		sort: 50,

		caption: { key: 'cloud.common.print' },
		iconClass: 'tlb-icons ico-print-preview',
		type: ItemType.Item,
		fn: () => {},
		hideItem: false,
	},
];

export const itemList: ConcreteMenuItem[] = [
	{
		id: 'create',
		sort: 0,
		caption: { key: 'cloud.common.taskBarNewRecord' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-rec-new',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},
	{
		id: 'd0',
		type: ItemType.Divider,
		hideItem: false,
	},
	{
		id: 'delete',
		sort: 10,
		caption: { key: 'cloud.common.taskBarDeleteRecord' },
		type: ItemType.Item,
		iconClass: 'tlb-icons ico-rec-delete',
		disabled: true,
		permission: '681223e37d524ce0b9bfa2294e18d650',
		fn: () => {},
		hideItem: false,
	},
];

export const radioSample: ConcreteMenuItem = {
	id: 'filterBoQ',
	caption: { key: 'cloud.common.filterAssigned' },
	type: ItemType.Radio,
	iconClass: 'tlb-icons ico-filter-assigned',
	isDisplayed: true,
	fn: () => {}
};

export const dropDownSample: ConcreteMenuItem = {
	id: 'gridSearchAll',
	sort: 150,
	caption: { key: 'cloud.common.taskBarSearch' },
	type: ItemType.DropdownBtn,
	cssClass: 'tlb-icons ico-search-all',
	fn: () => {},
	hideItem: false,
	list: {}
};
