/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { IMenuItemsList } from '@libs/ui/common';

@Component({
	selector: 'ui-container-system-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class UiContainerSystemNavbarComponent {
	@Input()
	public navBar!: IMenuItemsList;
}
