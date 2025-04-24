/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, HostListener, Input, OnInit } from '@angular/core';
import { IDropDownButton, IDropDownButtonData, IStatus } from '../../model/interfaces/dropdown-button.model';

/**
 * @ngdoc component
 * @name DropdownbuttonComponent, itwo40-dropdownbutton
 * @element div
 * @restrict attribute
 * @usageExample  <div ui-common-dropdownbutton [data-dropdown-button]="mainMenuDeclaration"></div>
 */

@Component({
	selector: '[ui-common-dropdown-button]',
	templateUrl: './dropdown-button.component.html',
	styleUrls: ['./dropdown-button.component.scss'],
})
export class UiCommonDropdownButtonComponent implements OnInit, IDropDownButton {
	@Input('data-dropdown-button') dropDownButton!: IDropDownButtonData;
	status: IStatus = {
		isOpen: false,
	};

	disabled!: boolean;
	constructor() {}

	ngOnInit(): void {
		if (this.dropDownButton.hasOwnProperty('disabled')) {
			this.disabled = this.dropDownButton.disabled || false;
		}
	}

	/**
	 * @ngDoc function
	 * @name toggleDropDown
	 * @methodOf DropdownbuttonComponent
	 * @param event
	 * @description for toggle of isOpen
	 */

	toggleDropDown(event: Event): void {
		this.status.isOpen = !this.status.isOpen;
		event.stopPropagation();
	}
	/**
	 * @ngdoc function
	 * @name closeDropDown
	 * @methodOf DropdownbuttonComponent
	 * @description for closing after opening modal
	 */
	@HostListener('click', ['$event.target'])
	closeDropDown(): void {
		if (this.status.isOpen) this.status.isOpen = false;
	}

	/**
	 * @ngDoc function
	 * @name modal
	 * @methodOf DropdownbuttonComponent
	 * @param id as string
	 * @description it gets the id of item when event is emitted
	 */
	//for future use for modalOptions
	modal(id: string): void {}
}
