/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Meta, moduleMetadata } from '@storybook/angular';
import { HttpClientModule } from '@angular/common/http';

import { MenuListCheckComponent } from './menu-list-check.component';
import { TranslatePipe } from '@libs/platform/common';

export default {
	title: 'MenuListCheckComponent',
	component: MenuListCheckComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListCheckComponent<object>>;

export const Primary = {
	render: (args: MenuListCheckComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			caption: {
				key: 'cloud.common.taskBarGrouping',
				text: 'Grouping',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-group-columns',
			id: 't12',
			sort: 10,
			type: 'check',
			value: false,
			isSet: true,
		},
	},
};

export const checkButtonwithValueTrue = {
	render: (args: MenuListCheckComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			caption: {
				key: 'cloud.common.taskBarColumnFilter',
				text: 'Column Filter',
			},
			hideItem: false,
			iconClass: 'tlb-icons ico-search-column',
			id: 'gridSearchColumn',
			sort: 160,
			type: 'check',
			value: true,
			isSet: true,
		},
	},
};
