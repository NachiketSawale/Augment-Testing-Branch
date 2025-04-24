/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { IMenuItemsList } from '@libs/ui/common';

@Component({
	selector: 'ui-sidebar-title',
	templateUrl: './sidebar-title.component.html',
	styleUrls: ['./sidebar-title.component.scss'],
})
export class SidebarTitleComponent {

	/**
	  * List of tools 
	  */
	@Input() public toolbarData!: IMenuItemsList;

	/**
	 * Title of the header
	 */
	@Input() public title!: Translatable;

	// /**
	//  * Language for reports
	//  */
	// @Input() public reportLanguageToolbar!: IReportLanguageData;


}
