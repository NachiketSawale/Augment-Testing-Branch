/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PlatformTranslateService } from '@libs/platform/common';

import { IDialogData } from '../../model/interfaces/dialog-data-interface';

/**
 * Base component rendering the dialog framework.
 */
@Component({
	selector: 'ui-common-modal-dialog-window',
	templateUrl: './modal-dialog-window.component.html',
	styleUrls: ['./modal-dialog-window.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ModalDialogWindowComponent<TValue, TBody, TDetailsBody = void> implements OnInit {
	public constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData<TValue, TBody, TDetailsBody>,
		private translateService: PlatformTranslateService
	) {}

	/**
	 * Initializes window component.
	 */
	public ngOnInit() {
		this.translateService.load(['ui.common']);
	}
}
