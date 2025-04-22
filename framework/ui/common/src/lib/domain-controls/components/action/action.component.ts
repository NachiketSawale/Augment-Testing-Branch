/*
 * Copyright(c) RIB Software GmbH
 */


import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';

import { ConcreteMenuItem, IMenuItemsList } from '../../../model/menu-list/interface';
import { IActionControlContext } from '../../model/action-control-context.interface';
import { IReadOnlyPropertyAccessor } from '@libs/platform/common';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { FieldDataMode } from '../../../model/fields';

@Component({
	selector: 'ui-common-action',
	templateUrl: './action.component.html',
	styleUrl: './action.component.scss',
})

/**
 * Represents Action field
 */
export class ActionComponent<T extends object> extends DomainControlBaseComponent<ConcreteMenuItem<T>[] | ConcreteMenuItem<T>, IActionControlContext<T>> implements AfterViewInit {

	/**
	 * Used to initialize elementRef.
	 */
	public readonly elementRef = inject(ElementRef);

	/**
	 * Used to set updated action items value.
	 */
	private actionItem!: ConcreteMenuItem<T> | ConcreteMenuItem<T>[];


	/**
	 * menu list tools
	 */
	public readonly tools: IMenuItemsList<T> = {
		cssClass: '',
		showImages: true,
		showTitles: false,
		isVisible: true,
		activeValue: '',
		overflow: false,
		iconClass: '',
		layoutChangeable: false,
		items: []
	};

	public constructor() {
		super();
	}

	public ngAfterViewInit() {
		this.updateActionItemStyle();
	}

	/**
	 * Used to set updated action items value.
	 */
	public set value(item: ConcreteMenuItem<T> | ConcreteMenuItem<T>[]) {
		if (this.actionItem !== item) {
			this.actionItem = item;
		}
	}

	/**
	 * Used to apply styles to menu list ul element to
	 * display action items in single row.
	 */
	public updateActionItemStyle() {
		const element = this.elementRef.nativeElement.querySelector('ul');
		element.setAttribute('style', 'display:flex');
	}

	/**
	 * Used to get action items based on actionSource and
	 * displayed through menu-list.
	 */
	public getActionItems() {
		this.tools.items = [];
		const actionSource = this.controlContext.actionsSource;

		switch (actionSource) {
			case FieldDataMode.FieldDefElseModel:
				this.getFieldActionItem();
				break;
			case FieldDataMode.ModelElseFieldDef:
				this.getModelActionItem();
				break;
			case FieldDataMode.Both:
				this.getBothActionItems();
				break;
			default:
				//default case FieldDataMode.FieldDefElseModel
				this.getFieldActionItem();
				break;
		}
	}

	/**
	 * Used to get action items from model.
	 */
	public getModelActionItem() {
		this.value = this.controlContext.value as ConcreteMenuItem<T> | ConcreteMenuItem<T>[];

		if (Array.isArray(this.actionItem)) {
			this.actionItem.forEach((item) => {
				this.tools.items?.push(item);
			});
		} else {
			this.tools.items?.push(this.actionItem as ConcreteMenuItem<T>);
		}
	}

	/**
	 * Used to get action items from field definition.
	 */
	public getFieldActionItem() {
		this.value = this.controlContext.actions as ConcreteMenuItem<T>[];
		(this.actionItem as ConcreteMenuItem<T>[])?.forEach((item) => {
			this.tools.items?.push(item);
		});
	}

	/**
	 * Used to get action items from both field and model definition
	 */
	public getBothActionItems() {
		const actionItems: ConcreteMenuItem<T>[] = [];
		const modelActionItem = this.controlContext.value;
		const fieldActionItem = this.controlContext.actions;
		const modelActionItemArray = Array.isArray(modelActionItem) ? modelActionItem : [modelActionItem];

		for (const modelItem of modelActionItemArray) {
			const existActionItem = fieldActionItem?.some(fieldItem => modelItem?.id === fieldItem.id);

			if (!existActionItem) {
				actionItems.push(modelItem as ConcreteMenuItem<T>);
			}
		}

		for (const obj of fieldActionItem as ConcreteMenuItem<T>[]) {
			actionItems.push(obj);
		}

		this.tools.items = actionItems;
	}


	/**
	 * Used to display text along with actions if provided.
	 */
	public get displayText() {
		this.getActionItems();

		if (this.controlContext.displayText) {
			const entity = this.controlContext.entityContext.entity as T;
			const displayText = (this.controlContext.displayText as IReadOnlyPropertyAccessor<T>).getValue(entity);

			return displayText;
		}
		return '';
	}
}
