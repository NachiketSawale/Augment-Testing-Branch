/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { HttpClientModule } from '@angular/common/http';

import { TranslatePipe } from '@libs/platform/common';
import { MenuListOverflowComponent } from './menu-list-overflow.component';

export default {
	title: 'MenuListOverflowComponent',
	component: MenuListOverflowComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListOverflowComponent<object>>;

export const overflowButton = {
	render: (args: MenuListOverflowComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			caption: {
				key: 'cloud.common.viewerConfiguration',
				text: 'viewerConfiguration',
			},
			hideItem: false,
			iconClass: 'ico-menu dropdown-toggle tlb-i',
			id: 't12',
			sort: 10,
			type: 'overflow-btn',
			value: false,
			isSet: true,
		},
	},
};
