/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * @ngdoc Statusbar-component
 * @name platform.component:UiCommonStatusBarElement
 * @element div
 * @description Displays a status bar Element for Status Bar.
 */

import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { IFieldsInterface, IFieldsNewInterface, IStatusBarComponentInterface } from '../../model/interfaces/status-bar.interface';

@Component({
	selector: 'ui-common-status-bar-element',
	templateUrl: './status-bar-element.component.html',
	styleUrls: ['./status-bar-element.component.scss'],
})
export class UiCommonStatusBarElementComponent implements OnInit {
	@Input()
	rowCount!: number;
	currentTarget!: number;
	fieldsValueInStatusBar!: number;

	/**
  
	 * To set label in status bar
  
	 */

	@Input()
	items = 'items';

	/**
   
	  * To get text color for label and status count
   
	  */

	@Input()
	textColor?: string;

	/**
   
	  * To get backgroundcolor for status bar
   
	  */

	@Input()
	backgroundColor?: string;

	/**
   
	  * To choose font family for label and status count
   
	  */

	@Input()
	fontFamily?: string;

	/**
   
	  * To set font weigth to label and status count
   
	  */

	@Input()
	fontWeight!: number;
	statusBarMockData = {
		fields: [
			{
				align: '',
				cssClass: '',
				disabled: false,
				ellipsis: false,
				id: '',
				toolTip: '',
				type: '',
				value: 100,
				visible: false,
				iconClass: '',
				func: () => {},
				url: '',
			},
		],
		field: {
			align: 'left',
			cssClass: '',
			disabled: false,
			ellipsis: true,
			id: 'status',
			toolTip: '',
			type: 'text',
			value: 100,
			iconClass: '',
			visible: true,
			func: () => {},
			url: '',
		},
		newFields: {
			align: 'left',
			cssClass: '',
			disabled: false,
			ellipsis: true,
			id: 'status',
			toolTip: '',
			type: 'text',
			value: 100,
			visible: true,
			iconClass: '',
			func: () => {},
			url: '',
		},
		changedFields: {
			id: '',
			value: 100,
		},
		options: {
			multiPopup: false,
			plainMode: true,
			hasDefaultWidth: false,
		},
		fields2: {
			align: '',
			cssClass: '',
			disabled: true,
			ellipsis: true,
			id: '',
			toolTip: '',
			type: '',
			value: 2,
			visible: true,
			iconClass: '',
			func: () => {},
			url: '',
		},
		toolTip: {},
	};

	constructor(private ref: ChangeDetectorRef, private element: ElementRef) {}

	ngOnInit(): void {
		let field: IFieldsInterface = {
			align: '',
			cssClass: '',
			disabled: false,
			ellipsis: false,
			id: '',
			toolTip: '',
			type: '',
			value: 100,
			iconClass: '',
			visible: false,
		};
		(this.fieldsValueInStatusBar = field.value), (this.rowCount = this.fieldsValueInStatusBar);
		if (field.visible === true) {
			this.switchToNewToolTipDirective();
			switch (field.type) {
				case 'text':
					let spanTemplate = '<span *ngIf="field.value" custom-tooltip="{{field.toolTip}}" class="item {{field.cssClass}}" ngClass="{\'ellipsis\': field.ellipsis}" (click)="field.func()" [disabled]="field.disabled">{{field.value}} </span>';
					this.element.nativeElement.innerHtml = spanTemplate;
					break;
				case 'button':
					(() => {
						let actualIconClass = _.isEmpty(_.trim(field.iconClass)) ? '' : field.iconClass + ' block-image';
						let buttonTemplate = '<button class="item {{field.cssClass}} ' + actualIconClass + '" (click)="field.func()" custom-tooltip="{{field.toolTip}}" [disabled]="field.disabled">{{field.value}}</button>';

						this.element.nativeElement.innerHtml = buttonTemplate;
					})();
					break;
				case 'image':
					let imageTemplate = '<i class="item image {{field.cssClass}} {{field.iconClass}}" custom-tooltip="{{field.toolTip}}" data-ng-src="{{field.url}}" (click)="field.func()" [disabled]="field.disabled"></i>';
					this.element.nativeElement.innerHtml = imageTemplate;
					break;
				case 'sublist':
					this.appendSubList();
					break;
				case 'dropdown-btn':
					let dropDownTemplate =
						'<button data-ng-if="field.value || field.iconClass" class="item {{field.cssClass}} {{field.iconClass}}" data-ng-click="executeFn()" data-data="field" data-ng-disabled="field.disabled"><span>{{field.value}}</span></button>';
					this.element.nativeElement.innerHtml = dropDownTemplate;
					break;
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name appendSubList
	 * @description assign HTML to the subListTemplate.
	 *
	 * @return {}
	 */

	appendSubList() {
		let fieldObj: IStatusBarComponentInterface = this.statusBarMockData;
		let subListScope = fieldObj.field.value;
		let subListTemplate = '<itwo40-platform-status-bar-content [disabled]="field.disabled"></itwo40-platform-status-bar-content>';
		(this.element.nativeElement.innerHtml = subListTemplate), subListScope;
	}

	/**
	 * @ngdoc function
	 * @name switchToNewToolTipDirective
	 * @description Checks if value is classified as a String primitive or object.
	 *
	 * @return {}
	 */
	switchToNewToolTipDirective() {
		let field: IFieldsNewInterface = this.statusBarMockData;
		if (field.toolTip && _.isString(field.toolTip)) {
			field.toolTip = {
				caption: field.toolTip,
			};
		}
	}

	/**
	 * @ngdoc function
	 * @name ngOnDestroy
	 * @description destoy the executeFn function and element.
	 *
	 * @return {void}
	 */

	ngOnDestroy(): void {
		this.element;
	}
}
