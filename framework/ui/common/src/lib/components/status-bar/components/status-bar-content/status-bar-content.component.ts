/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * @ngdoc component
 * @name platform.component:UiCommonStatusBarContentComponent
 * @element div
 * @description Displays a status bar Content for Status Bar.
 */
import { Component, Input } from '@angular/core';

@Component({
	selector: 'ui-common-status-bar-content',
	templateUrl: './status-bar-content.component.html',
	styleUrls: ['./status-bar-content.component.scss']
})
export class UiCommonStatusBarContentComponent {
	/**
	 * To get background color for status bar
	 */

	@Input()
	public backgroundColor: string = '#dcdcdc';
}
