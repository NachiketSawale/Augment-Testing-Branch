/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/**
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { IDropDownButtonList, IItems } from '@libs/ui/common';
import { IMenulist, IUiLangOption } from '../../../model/menu-list-old/menu-list.model';

/**
 * @ngdoc component
 * @name MenulistComponent, itwo40-menulist
 * @element div
 * @restrict attribute
 * @usageExample  <div (change)='modal($event)' [isOpen]="status.isOpen" itwo40-menulist [dropDownList]="dropDownButton.list"></div>
 */

@Component({
	selector: '[ui-common-menu-list-sidebar-dropdown]',
	templateUrl: './menu-list-sidebar-dropdown.component.html',
	styleUrls: ['./menu-list-sidebar-dropdown.component.css'],
})
export class UiCommonMenuListSideBarDropdownComponent implements OnInit, IMenulist {
	@Input() lastButton!: string;
	@Input() dropDownList!: IDropDownButtonList;
	@Input() isOpen!: boolean;
	@Output() change = new EventEmitter<string>();
	@ViewChild('container', { read: ViewContainerRef })
	container!: ViewContainerRef;
	//Template reference type kept 'any' as we are not sure what type we should assign here
	@ViewChild('template') template!: TemplateRef<any>;

	existingLanguage!: number | string;
	existingCulture!: string;
	uiLangOptions: IUiLangOption = {
		selectedId: {
			languageName: '',
		},
	};

	enableBootstrapTitle!: string;
	classList!: string;

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		this.classList = this.dropDownList.cssClass + ' sidebar-icon' || ' ';
		const view = this.template.createEmbeddedView(null);
		this.container.insert(view);
		view.detectChanges();
	}

	/**
	 * @ngDoc function
	 * @name showModal
	 * @methodOf MenulistComponent
	 * @param id string
	 * @description This function emits the id
	 */
	showModal(id: string): void {
		this.change.emit(id);
	}

	/**
	 *
	 * @param item
	 */
	onCallback = (item: IItems): void => {
		if (item.fn) {
			item.fn(item);
		}
	};
}
