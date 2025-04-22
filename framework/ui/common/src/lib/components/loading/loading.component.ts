/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { ITranslatable } from '@libs/platform/common';

@Component({
	selector: 'ui-common-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss'],
})
export class UiCommonLoadingComponent {
	/**
	 * Represents the loading state.
	 */
	@Input()
	public loading: boolean = false;

	/**
	 * Whether show the backdrop.
	 */
	@Input()
	public backdrop: boolean = false;

	/**
	 * The text display when loading
	 */
	@Input()
	public info?: ITranslatable;

	/**
	 * The custom css class.
	 */
	@Input()
	public cssClass?: string;
}
