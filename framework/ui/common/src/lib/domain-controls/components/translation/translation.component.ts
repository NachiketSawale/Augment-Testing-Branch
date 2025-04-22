/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { IDescriptionInfo } from '@libs/platform/common';
import { IControlContext } from '../../model/control-context.interface';

@Component({
	selector: 'ui-common-translation',
	templateUrl: './translation.component.html',
	styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent extends DomainControlBaseComponent<IDescriptionInfo, IControlContext<IDescriptionInfo>> {
	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();
		// TODO: inject settings object with restriction RegEx?
	}

	/**
	 * Retrieves the current value converted to an translated string.
	 */
	public get value() {
		return this.controlContext.value?.Translated;
	}

	/**
	 * Sets the current value as string.
	 * @param text The raw value as a string.
	 */
	public set value(text) {
		if (text && this.controlContext.value) {
			this.controlContext.value.Translated = text;
		} else {
			this.controlContext.value = {
				Description: '',
				DescriptionTr: 1,
				DescriptionModified: false,
				Translated: text ?? '',
				VersionTr: 1,
				Modified: false,
				OtherLanguages: null,
			};
		}
	}
}
