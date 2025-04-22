/**
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { PropertyType } from '@libs/platform/common';
import { ISelectControlContext } from '../../model/select-control-context.interface';
import { IRadioItem } from '../../model/radio-item.interface';

/**
 * Radio domain control functionality.
 */
@Component({
	selector: 'ui-common-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
})
export class RadioComponent extends DomainControlBaseComponent<PropertyType, ISelectControlContext> {
	/**
	 * Radio items information.
	 */
	public radioItemInfo: IRadioItem[] = [];

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		this.radioItemInfo = this.getRadioItems();
	}

	/**
	 * Provide radio items info.
	 * @returns {IRadioItem[]} Radio items.
	 */
	private getRadioItems(): IRadioItem[] {
		return (
			this.controlContext.itemsSource?.items.map((item) => {
				return {
					id: item.id as string | number | boolean,
					displayName: item.displayName,
					iconCSS:item.iconCSS
				};
			}) ?? []
		);
	}
}
