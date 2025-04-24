/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
	selector: '[ui-common-menulist-edit-view]',
	templateUrl: './menulist-edit-view.component.html',
	styleUrls: ['./menulist-edit-view.component.scss'],
})
export class UiCommonMenulistEditViewComponent implements OnInit {
	/**
	 * To change background color of list
	 */
	@Input() backgroundColor!: string;

	/**
	 * To change font weight of menulist caption
	 */
	@Input() fontWeight?: number;

	/**
	 * To change font family of menulist caption
	 */
	@Input() fontFamily?: string;

	/**
	 * To change text color of menulist caption
	 */
	@Input() textColor!: string;

	/**
	 * To remember previously opened tab of sidebar
	 */
	@Input() lastButton!: string;

	/**
	 * Data to display menulist
	 */
	@Input() dropDownList!: any;

	/**
	 * To open and close menulist
	 */
	@Input() isOpen!: boolean;

	@Output() change = new EventEmitter<string>();
	@ViewChild('container', { read: ViewContainerRef })
	container!: ViewContainerRef;
	//Template reference type kept 'any' as we are not sure what type we should assign here
	@ViewChild('template') template!: TemplateRef<any>;
	//	@ViewChild('sublist') sublist!: TemplateRef<any>;

	enableBootstrapTitle!: string;
	classList!: string;
	menulist: any;

	constructor() {}

	ngOnInit(): void {
		this.menulist = this.dropDownList.items[0].list;
	}

	ngAfterViewInit(): void {
		this.classList = this.dropDownList.cssClass + ' sidebar-icon';
		//const v = this.sublist.createEmbeddedView(null);
		const view = this.template.createEmbeddedView(null);
		this.container.insert(view);
		view.detectChanges();
	}

	/**
	 * This function emits the id
	 * @param {string} id id of selected menu
	 */
	showModal(id: string): void {
		this.change.emit(id);
	}
}
