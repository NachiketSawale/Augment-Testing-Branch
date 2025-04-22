/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClientModule } from '@angular/common/http';
import { moduleMetadata, Meta } from '@storybook/angular';

import { TranslatePipe } from '@libs/platform/common';
import { MenuListBtnComponent } from './menu-list-btn.component';

export default {
	title: 'MenuListBtnComponent',
	component: MenuListBtnComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListBtnComponent<object>>;

export const Primary = {
	render: (args: MenuListBtnComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			caption: {
				text: 'Pin Selected Item',
				key: 'Pin Selected Item',
			},
			cssClass: 'active',
			hideItem: false,
			iconClass: 'tlb-icons ico-set-prj-context',
			id: 't-pinningctx',
			sort: 120,
			type: 'item',
			isSet: true,
		},
	},
};

export const newRecordButton = {
	render: (args: MenuListBtnComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: true,
		menuItem: {
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
			type: 'item',
		},
	},
};
