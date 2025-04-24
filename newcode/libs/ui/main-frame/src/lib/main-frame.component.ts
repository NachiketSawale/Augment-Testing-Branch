/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ViewContainerRef } from '@angular/core';
import { UiCommonDialogService } from '@libs/ui/common';
import { UiSidebarService } from '@libs/ui/sidebar';

@Component({
	selector: 'ui-main-frame',
	templateUrl: './main-frame.component.html',
	styleUrls: ['./main-frame.component.scss'],
})
export class MainFrameComponent {
	public constructor(private view: ViewContainerRef, private modalDialogService: UiCommonDialogService, public sidebarService: UiSidebarService) {
		this.sidebarService.initializeSidebar();
	}
}
