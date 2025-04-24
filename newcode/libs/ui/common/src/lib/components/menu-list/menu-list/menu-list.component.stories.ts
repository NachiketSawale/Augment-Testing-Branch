/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';

import { MenuListDropdownComponent } from '../menu-list-dropdown/menu-list-dropdown.component';
import { MenuListOverflowComponent } from '../menu-list-overflow/menu-list-overflow.component';
import { MenuListCheckComponent } from '../menu-list-check/menu-list-check.component';
import { MenuListRadioComponent } from '../menu-list-radio/menu-list-radio.component';
import { MenuListBtnComponent } from '../menu-list-btn/menu-list-btn.component';
import { MenuListComponent } from './menu-list.component';
import { TranslatePipe } from '@libs/platform/common';
import { menu } from '../../../mock-data/menu-list.mockdata';

export default {
	title: 'MenuListComponent',
	component: MenuListComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			declarations: [MenuListBtnComponent, MenuListCheckComponent, MenuListDropdownComponent, MenuListRadioComponent, MenuListOverflowComponent],
			providers: [TranslatePipe],
		}),
	],
} as Meta<MenuListComponent>;

export const Primary = {
	render: (args: MenuListComponent) => ({
		props: args,
	}),
	args: {
		sublist: false,
		menu: menu,
	},
};

export const menuListVisiblity = {
	render: (args: MenuListComponent) => ({
		props: args,
	}),
	args: {
		sublist: true,
		menu: menu,
	},
};
