/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	DomainControlBaseComponent
} from '../domain-control-base/domain-control-base.component';
import { PropertyType, Translatable } from '@libs/platform/common';
import { ISelectControlContext } from '../../model/select-control-context.interface';

interface IUiSelectItem {
	readonly id: string;

	readonly displayName: Translatable;

	isSelected: boolean;
}

/**
 * A dropdown control without an input box.
 */
@Component({
	selector: 'ui-common-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.css']
})
export class SelectComponent extends DomainControlBaseComponent<PropertyType, ISelectControlContext> {

	public selectedItemId: string | undefined;

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
	}

	public get items(): IUiSelectItem[] {
		return this.controlContext.itemsSource?.items.map(item => {
			return {
				id: item.id.toString(),
				displayName: item.displayName,
				isSelected: false
			};
		}) ?? [];
	}

	public ngOnInit(): void {
		const selectedItem = this.items.find(item => item.isSelected);
		if (selectedItem) {
			this.selectedItemId = selectedItem.id;
		}
	}

	public ngOnChanges(): void {
		console.log('Selected item ID:', this.selectedItemId);
	}
}