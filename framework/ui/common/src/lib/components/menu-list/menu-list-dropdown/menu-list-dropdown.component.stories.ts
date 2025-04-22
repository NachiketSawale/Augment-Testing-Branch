/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { MenuListDropdownComponent } from './menu-list-dropdown.component';
import { TranslatePipe } from '@libs/platform/common';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

export default {
	title: 'MenuListDropdownComponent',
	component: MenuListDropdownComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListDropdownComponent<object>>;

const Template: Story<MenuListDropdownComponent<object>> = (args: MenuListDropdownComponent<object>) => ({
	component: MenuListDropdownComponent,
	props: args,
});
export const Primary = {
	render: (args: MenuListDropdownComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			id: 't199',
			caption: { key: 'cloud.common.exportClipboard' },
			sort: 199,
			type: 'dropdown-btn',
			cssClass: 'tlb-icons ico-clipboard',
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [
					{
						id: 't100',
						sort: 100,
						type: 'check',
						caption: { key: 'cloud.common.exportArea' },
						fn: () => {
							throw new Error('This method is not implemented');
						},
						value: false,
					},
					{
						id: 't200',
						sort: 200,
						caption: { key: 'cloud.common.exportCopy' },
						fn: () => {
							throw new Error('This method is not implemented');
						},
						type: 'item',
					},
					{
						id: 't300',
						sort: 300,
						caption: { key: 'cloud.common.exportPaste' },
						fn: () => {
							throw new Error('This method is not implemented');
						},
						type: 'item',
					},
					{
						id: 'dCopyPaste',
						sort: 400,
						type: 'divider',
					},
					{
						id: 't400',
						sort: 500,
						caption: { key: 'cloud.common.exportWithHeader' },
						fn: () => {
							throw new Error('This method is not implemented');
						},
						type: 'check',
					},
				],
			},
			iconClass: 'tlb-icons ico-clipboard',
			hideItem: false,
		},
	},
};

export const dropdownBtn = Template.bind({});
dropdownBtn.args = {
	showTitles: true,
	menuItem: {
		id: 't200',
		caption: 'gridSettings',
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
};
