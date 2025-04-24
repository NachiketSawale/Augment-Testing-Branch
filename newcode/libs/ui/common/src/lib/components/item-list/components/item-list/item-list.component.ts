/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IItems } from '../../models/items';

@Component({
	selector: '[ui-common-item-list-directive]',
	templateUrl: './item-list.component.html',
	styleUrls: ['./item-list.component.scss'],
})

/**
 * @ngdoc component
 * @name UiCommonItemListComponent
 * @usage <div ui-common-item-list-directive></div>
 * @restrict A
 * @description
 * Component that allows to render item-list.
 *
 * @param {IItems>} list  list data.
 * @param {string} itemTemplate  contains html data.
 * @param  {number|string} clickFnValue  emitted data.
 */
export class UiCommonItemListComponent implements OnInit {
	/**
	 * This variable is used to store the emitted value.
	 * @property  list
	 * @type {IItems}
	 */
	@Input() list!: Array<IItems>;

	/**
	 * This variable is used to bind dynamic template
	 * @property itemTemplate
	 * @type {string}
	 */

	@Input() itemTemplate: string = ``;

	/**
	 * @property  clickFnValue
	 * @type {string|number}
	 * @description
	 * This value is used for emitted value
	 */
	@Output() clickFnValue = new EventEmitter<string | number>();

	constructor() {}

	ngOnInit(): void {}

	/**
	 * @ngdoc function
	 * @name clickFn
	 * @function
	 * @methodOf ItemListComponent
	 * @description
	 * This function is used to emit the value.
	 * @param {string|number} value -emitted value
	 * @return {void}
	 */
	clickFn(value: string | number): string | number {
		this.clickFnValue.emit(value);
		return value;
	}
}
