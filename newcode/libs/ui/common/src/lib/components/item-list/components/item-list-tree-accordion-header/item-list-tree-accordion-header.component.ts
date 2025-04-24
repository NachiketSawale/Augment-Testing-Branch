/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, HostListener, Input, OnInit } from '@angular/core';
import { items } from '../../../../mock-data/items';
import { treeitem } from '../../../../mock-data/treeitem';
import { ITreeItems } from '../../models/item-list.model';
import { ITreeOptions } from '../../models/tree-options';

@Component({
	selector: '[ui-common-item-list-tree-accordion-header]',
	templateUrl: './item-list-tree-accordion-header.component.html',
	styleUrls: ['./item-list-tree-accordion-header.component.scss'],
})

/**
 * @ngdoc component
 * @name UiCommonItemListTreeAccordionHeaderComponent
 * @usage <div ui-common-item-list-tree-accordion-header></div>
 * @restrict A
 * @description
 * Component that allows to render item-list-tree-accordion-header.
 *
 * @param {ITreeItems} treeitem  treeitem data.
 * @param {ITreeItems[]} treeitems  treeitems data.
 * @param {ITreeOptions} options  option object.
 */
export class UiCommonItemListTreeAccordionHeaderComponent implements OnInit {
	/**
	 * Variable for treeitems data.
	 * @property treeitems
	 * @type {ITreeItems}
	 */
	@Input() treeitem: ITreeItems = treeitem;

	/**
	 * Variable for treeitems data.
	 * @property treeitems
	 * @type {Array<ITreeItems>}
	 */
	@Input() treeitems: ITreeItems[] = items;

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
	 * @name expand
	 * @function
	 * @methodOf PlatformItemListTreeAccordionHeaderComponent
	 * @description
	 * This function is used to expand the list and perform action for mouse event and keyboard event.
	 * @param {ITreeItems} item  - to pass the item list
	 * @param {boolean} mouseclick -to pass boolean value for mouse event
	 * @param {KeyboardEvent} event -to capture the event
	 */
	@HostListener('keydown', ['$event'])
	expand(item: ITreeItems, mouseclick: boolean, event: KeyboardEvent): void {
		this.treeitem.expanded = !this.treeitem.expanded;
		/*
    13 --> ok
    37 --> left arrow
    39 --> right arrow
   */
		let keycodes = ['13', '37', '39'];
		if (mouseclick || keycodes.indexOf(event.code) > -1) {
			event.stopPropagation();
			event.preventDefault();
			if ((mouseclick && !item.expanded) || event.code === '39') {
				this.options.expandFn(item.id);
			} else if ((mouseclick && item.expanded) || event.code === '37') {
				this.options.collapseFn(item.id);
			} else if (event.code === '13') {
				this.header(item.id, event);
			}
		}
	}
	/**
	 * @ngdoc function
	 * @name header
	 * @methodOf PlatformItemListTreeAccordionHeaderComponent
	 * @description
	 * This function is used to call clickHeaderFn.
	 * @param {number|string} id - to pass the id
	 * @param {Event} event -to capture the event
	 * @return {void}
	 */
	header(id: number | string, event: Event): void {
		this.options.clickHeaderFn(id, event);
	}
}
