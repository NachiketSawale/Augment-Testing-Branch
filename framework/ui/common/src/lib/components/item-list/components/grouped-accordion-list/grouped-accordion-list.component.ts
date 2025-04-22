/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { IGroupedList } from '../../models/grouped-list.model';
import { IGroupedListCfg } from '../../models/grouped-list-cfg';

@Component({
	selector: '[ui-common-grouped-accordion-list-directive]',
	templateUrl: './grouped-accordion-list.component.html',
	styleUrls: ['./grouped-accordion-list.component.scss'],
})
/**
 * @ngdoc component
 * @name UiCommonGroupedAccordionListComponent
 * @usage <div ui-common-grouped-accordion-list-directive></div>
 * @restrict A
 * @description
 * Component that allows to render grouped accordion list.
 * @param {IGroupedList[]} groupedList  Displaying list
 * @param {string|number} clickFnValue  Used to emit the value
 */
export class UiCommonGroupedAccordionListComponent implements OnInit {
	/**
	 * This variable is for groupedList data
	 * @property groupedList
	 * @type {IGroupedList[]}
	 */
	@Input() groupedList!: IGroupedList[] ;
	/**
	 * This variable is for groupedListCfg data
	 * @property groupedListCfg
	 * @type {IGroupedListCfg}
	 */
	@Input() groupedListCfg!: IGroupedListCfg;
	/**
	 * @property clickFnValue
	 * @type {string | number}
	 * @description
	 * This variable is for emitted value
	 */

	@Output() clickFnValue = new EventEmitter<string | number>();

	constructor() {}

	ngOnInit(): void {
		this.refresh();
	}

	/**
	 * @ngdoc function
	 * @name refresh
	 * @function
	 * @methodOf PlatformGroupedAccordionListComponent
	 * @description
	 * This function is used to refresh the list and toggle the icon.
	 * @return {string}
	 */

	refresh() {
		if(typeof this.groupedList !== 'undefined'){
			this.groupedList.forEach((val: any, i: number) => {
				val.toggleClass = this.groupedList[i].visible ? 'ico-up' : 'ico-down';
			});
		}
	}

	/**
	 * @ngdoc function
	 * @name invert
	 * @function
	 * @methodOf PlatformGroupedAccordionListComponent
	 * @description
	 * This function is used to invert the icon and call the refresh function.
	 * @param {string} groupKey - emitted value
	 * @return {void}
	 */

	invert(groupKey: number) {
		if(typeof this.groupedList !== 'undefined'){
		this.groupedList[groupKey].visible = !this.groupedList[groupKey].visible;
		}
		this.refresh();
	}

	/**
	 * @ngdoc function
	 * @name clickFn
	 * @function
	 * @methodOf PlatformAccordionListComponent
	 * @description
	 * This function is used to emit the value
	 * @param {string|number} value - emitted value
	 * @return {string |number}
	 */

	clickFn(value: string | number): string | number {
		this.clickFnValue.emit(value);
		return value;
	}
}
