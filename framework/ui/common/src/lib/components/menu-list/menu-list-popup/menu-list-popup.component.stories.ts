/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';
import { Subject } from 'rxjs';

import { TranslatePipe } from '@libs/platform/common';
import { ActivePopup } from '../../../popup/model/active-popup';
import { MenuListPopupComponent } from './menu-list-popup.component';
import { mockMenuList} from '../../../mock-data/menu-list.mockdata';


const activeP = new Subject<ActivePopup>();
const menuList = mockMenuList;
export default {
	title: 'MenuListPopupComponent',

	component: MenuListPopupComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
			providers: [TranslatePipe, { provide: 'menuList', useValue: menuList }, { provide: 'activePopup', useValue: activeP }],
		}),
	],
} as Meta<MenuListPopupComponent<object>>;

export const Primary = {
	render: (args: MenuListPopupComponent<object>) => ({
		props: args,
	}),
	args: {},
};
