/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { tabs } from '../../../../mock-data/tabs';
import { treeitem } from '../../../../mock-data/treeitem';
import { ITabs, ITreeItems } from '../../models/item-list.model';
import { ITreeOptions } from '../../models/tree-options';

@Component({
	selector: '[ui-common-item-list-tree-accordion-content]',
	templateUrl: './item-list-tree-accordion-content.component.html',
	styleUrls: ['./item-list-tree-accordion-content.component.scss'],
})

/**
 * @ngdoc component
 * @name UiCommonItemListTreeAccordionContentComponent
 * @usage <div ui-common-item-list-tree-accordion-content></div>
 * @restrict A
 * @description
 * Component that allows to render item-list-tree-accordion-content.
 *
 * @param {ITreeItems} treeitems  treeitems data.
 * @param {ITabs} childs  childs data.
 * @param {ITreeOptions} options  option object.
 */
export class UiCommonItemListTreeAccordionContentComponent implements OnInit {
	/**
	 * Variable for treeitems data.
	 * @property treeitems
	 * @type {ITreeItems}
	 */
	@Input() treeitem: ITreeItems = treeitem;

	/**
	 * Variable for childs data.
	 * @property childs
	 * @type {ITabs}
	 */
	@Input() childs: ITabs = tabs;

	/**
	 * Variable for object of functions.
	 * @property options
	 * @type {ITreeOptions}
	 */
	@Input() options!: ITreeOptions;

	constructor() {}

	ngOnInit(): void {}
	/**
	 * @ngdoc function
	 * @name tabFn
	 * @function
	 * @methodOf PlatformItemListTreeAccordionContentComponent
	 * @description
	 * This function is used to call clickTabfn.
	 * @param {number|string} id  - to pass the id
	 * @param {number|string} tabId -to pass table id
	 * @param {Event} event -to capture the event
	 * @return {void}
	 */

	tabFn(id: string | number, tabId: number | string, event: Event): void {
		this.options.clickTabFn(id, event, tabId);
	}
}
