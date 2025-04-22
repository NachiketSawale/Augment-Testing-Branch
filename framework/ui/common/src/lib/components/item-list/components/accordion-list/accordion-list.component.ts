/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IList } from '../../models/list';

@Component({
	selector: '[ui-common-accordion-list-directive]',
	templateUrl: './accordion-list.component.html',
	styleUrls: ['./accordion-list.component.scss'],
})
/**
 * @ngdoc component
 * @name AccordionListComponent
 * @usage <div ui-common-accordion-list-directive></div>
 * @restrict A
 * @description
 * Component that allows to render accordion list.
 *
 * @param {IList} list  Displaying list
 * @param {string|number} clickFnValue  Used to emit the value
 */
export class UiCommonAccordionListComponent implements OnInit {
	/**
	 * This variable is used for Lists of items for accordion-list
	 * @property list
	 * @type {IList}
	 */
	@Input() list : IList ={
		id: 2,
		groupId: 56,
		name: '',
		text:'',
		filename:'',
		path: '',
		pending: false,
		hasError :false,
		disabled : false,
		itemIcon : '',
	};

	/**
	 * @property  clickFnValue
	 * @type {string|number}
	 * @description
	 * This variable is used to store the emitted value
	 */
	@Output() clickFnValue = new EventEmitter<string | number>();

	constructor() {}

	ngOnInit(): void {}

	/**
	 * @ngdoc function
	 * @name clickFn
	 * @function
	 * @methodOf PlatformAccordionListComponent
	 * @description
	 * This function is used to emit the value
	 * @param {string|number} value - emitted value
	 * @return {string|number}
	 */

	clickFn(value: string | number): string | number {
		this.clickFnValue.emit(value);
		return value;
	}
}
