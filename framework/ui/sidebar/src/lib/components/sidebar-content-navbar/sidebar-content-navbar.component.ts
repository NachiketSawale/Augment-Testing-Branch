/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';

import { PlatformTranslateService } from '@libs/platform/common';

@Component({
	selector: 'ui-sidebar-sidebar-content-navbar',
	templateUrl: './sidebar-content-navbar.component.html',
	styleUrls: ['./sidebar-content-navbar.component.scss'],
})
export class UiSidebarContentNavbarComponent {
	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);
	
	/**
	 * option object
	 */
	public option = {
		title: this.translate.instant('cloud.desktop.sdMainSearchBtnGoogle').text,
	};
}
