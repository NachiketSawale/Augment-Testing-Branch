/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { items } from '../../../../mock-data/items';
import { ITreeItems } from '../../models/item-list.model';
import { ITreeOptions } from '../../models/tree-options';

@Component({
	selector: '[ui-common-item-list-tree]',
	templateUrl: './item-list-tree.component.html',
	styleUrls: ['./item-list-tree.component.scss'],
})

/**
 * @ngdoc component
 * @name UiCommonItemListTreeComponent
 * @usage <div ui-common-item-list-tree></div>
 * @restrict A
 *
 * @description
 * Component that allows to render item-list-tree.
 *
 * @param {Array<ITreeItems>} treeitems  treeitems data.
 * @param {ITreeOptions} options  option object.
 * @param  {ITreeItems} treeitem  treeitem data.
 * @param {string} searchmodule  searchmodule data.
 */
export class UiCommonItemListTreeComponent implements OnInit {
	/**
	 * This variable is for treeitems data.
	 * @property treeitems
	 * @type {Array<ITreeItems>}
	 */

	@Input() treeitems: ITreeItems[] = items;

	/**
	 * This variable is for object of  functions.
	 * @property options
	 * @type {ITreeOptions}
	 */
	@Input() options!: ITreeOptions;

	/**
	 * This variable is for treeitem data.
	 * @property treeitems
	 * @type {ITreeItems}
	 */
	@Input() treeitem!: ITreeItems;

	/**
	 * This variable accepts string to search the module.
	 * @property  searchmodule
	 * @type {string}
	 */
	@Input() searchmodule?: string = '';

	constructor() {}

	ngOnInit(): void {}
}
