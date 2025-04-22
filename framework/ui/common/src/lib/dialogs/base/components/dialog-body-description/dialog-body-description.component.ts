/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';

import { Translatable } from '@libs/platform/common';

import { IDialogBodyDescriptionBase } from '../../model/interfaces/dialog-body-description-base.interface';

/**
 * Component renders a description in a dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-dialog-body-description',
	templateUrl: './dialog-body-description.component.html',
	styleUrls: ['./dialog-body-description.component.scss'],
})
export class DialogBodyDescriptionComponent {

	/**
	 * Css class for the icon to be displayed.
	 */
	public get iconClass(): string | undefined {
		const val = this.value;
		if (typeof val === 'object' && 'iconClass' in val) {
			return val.iconClass;
		}

		return undefined;
	}

	/**
	 * The description text.
	 */
	public get text(): Translatable | undefined {
		if (typeof this.value === 'object') {
			if ('iconClass' in this.value || ('text' in this.value && typeof this.value.text === 'object')) {
				return this.value.text;
			}
		}
		return this.value;
	}

	/**
	 * Gets or sets the current value to display.
	 */
	@Input()
	public value?: IDialogBodyDescriptionBase | Translatable;
}
