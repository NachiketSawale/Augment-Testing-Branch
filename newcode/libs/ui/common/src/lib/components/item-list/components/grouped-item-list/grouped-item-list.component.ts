/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { IGroupedList } from '../../models/grouped-list.model';
import { IGroupedListCfg } from '../../models/grouped-list-cfg';

@Component({
	selector: '[ui-common-grouped-item-list-directive]',
	templateUrl: './grouped-item-list.component.html',
	styleUrls: ['./grouped-item-list.component.scss'],
})

/**
 * @ngdoc component
 * @name UiCommonGroupedItemListComponent
 * @usage <div ui-common-grouped-item-list-directive></div>
 * @restrict A
 * @description
 * Component that allows to render Grouped-item-list.
 * @param {Array<IGroupedList>} groupedList  groupedList data.
 * @param {string} groupTemplate  contains html data of groupTemplate.
 * @param {string} childProperty  contains childProperty data.
 * @param {string} itemTemplate  contains html data of itemTemplate.
 * @param {IGroupedListCfg} groupedListCfg  contains groupedListCfg data.
 */
export class UiCommonGroupedItemListComponent implements OnInit {
	/**
	 * This is used to bind groupedLists.
	 * @property groupedList
	 * @type {array<IGroupedList>}
	 */
	@Input() groupedList!: Array<IGroupedList>;

	/**
	 * This variable is for groupedListCfg data
	 * @property groupedListCfg
	 * @type {IGroupedListCfg}
	 */
	@Input() groupedListCfg!: IGroupedListCfg;

	/**
	 * This is used to render groupedTemplate.
	 * @property GroupedTemplate
	 * @type {string }
	 */
	@Input() groupTemplate: string = ``;

	/**
	 * This is used for childProperty.
	 * @property childProperty
	 * @type {string}
	 */
	@Input() childProperty: string = ``;

	/**
	 * This variable is used to render itemTemplate.
	 * @property itemTemplate
	 * @type {string}
	 *
	 */
	@Input() itemTemplate: string = ``;

	constructor() { }

	ngOnInit(): void { }

	/**
	 * @property {function} invert
	 * @param {string} groupKey - emitted value
	 * @returns {void}
	 * @description
	 * This function is used to invert the icon and call the
	 * refresh function
	 */
	invert(groupKey: number): void {
		if (typeof this.groupedList !== 'undefined') {
			this.groupedList[groupKey].visible = !this.groupedList[groupKey].visible;
		}
	}
}
