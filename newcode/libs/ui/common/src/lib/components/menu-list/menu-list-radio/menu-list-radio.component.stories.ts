/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';

import { TranslatePipe } from '@libs/platform/common';
import { MenuListRadioComponent } from './menu-list-radio.component';

export default {
	title: 'MenuListRadioComponent',
	component: MenuListRadioComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListRadioComponent<object>>;

export const Primary = {
	render: (args: MenuListRadioComponent<object>) => ({
		props: args,
	}),
	args: {
		showTitles: false,
		menuItem: {
			caption: {
				key: 'cloud.common.filterAssigned',
				text: 'Show only the assigned line items of the current selection',
			},
			iconClass: 'tlb-icons ico-filter-assigned ',
			id: 'filterBoQ',
			isDisplayed: true,
			type: 'radio',
		},
	},
};

export const activeRadioButton = {
	render: (args: MenuListRadioComponent<object>) => ({
		props: args,
	}),
	args: {
		activeValue: 'filterBoQAndNotAssigned',
		showTitles: false,
		menuItem: {
			caption: {
				key: 'cloud.common.filterAssignedAndNotAssigned',
				text: 'Show the assigned and the line items without assignment',
			},
			iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
			id: 'filterBoQAndNotAssigned',
			isDisplayed: true,
			type: 'radio',
		},
	},
};
