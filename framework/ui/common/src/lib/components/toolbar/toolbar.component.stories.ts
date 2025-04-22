/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';

import { MenuListComponent } from '../menu-list/menu-list/menu-list.component';
import { MenuListBtnComponent } from '../menu-list/menu-list-btn/menu-list-btn.component';
import { MenuListCheckComponent } from '../menu-list/menu-list-check/menu-list-check.component';
import { MenuListDropdownComponent } from '../menu-list/menu-list-dropdown/menu-list-dropdown.component';
import { MenuListRadioComponent } from '../menu-list/menu-list-radio/menu-list-radio.component';
import { MenuListOverflowComponent } from '../menu-list/menu-list-overflow/menu-list-overflow.component';
import { ToolbarComponent } from './toolbar.component';
import { TranslatePipe } from '@libs/platform/common';
import { menu } from '../../mock-data/menu-list.mockdata';

export default {
	title: 'ToolbarComponent',
	component: ToolbarComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			declarations:[MenuListComponent, MenuListBtnComponent, MenuListCheckComponent, MenuListDropdownComponent,MenuListRadioComponent, MenuListOverflowComponent],
			providers:[TranslatePipe]
		}),
	],
} as Meta<ToolbarComponent>;


export const Primary = {
	render: (args: ToolbarComponent) => ({
		props: args,
	}),
	args: {
		toolbarData:menu
	},
};

export const visibilityOfToolbarFalse = {
	render: (args: ToolbarComponent) => ({
		props: args,
	}),
	args: {
		toolbarData:menu
	},
};


