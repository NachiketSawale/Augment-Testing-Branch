/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';

import { /*getDialogFooterModelToken,*/ IDialogFooterModel } from '../../model/interfaces/dialog-footer-model.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component renders the footer of dialog and implements the footer basic functionality.
 */
@Component({
	selector: 'ui-common-modal-footer',
	templateUrl: './modal-footer.component.html',
	styleUrls: ['./modal-footer.component.scss'],
})
export class ModalFooterComponent<TValue, TBody, TDetailsBody = void> implements OnInit {
	/**
	 * Show/Hide Don't show again checkbox option.
	 */
	public showCheckboxOption: boolean = false;

	/**
	 * Checkbox value.
	 */
	public isChecked: boolean = false;

	// TODO: replace with custom, typed injection token
	public readonly data: {
		dialog: IDialogFooterModel<TValue, TBody, TDetailsBody>
	} = inject(MAT_DIALOG_DATA) /*inject(getDialogFooterModelToken<TValue, TBody, TDetailsBody>())*/;

	public constructor() {}

	/**
	 * Initialize footer component.
	 */
	public ngOnInit() {
		if (typeof this.data.dialog.doNotShowAgain === 'object') {
			this.showCheckboxOption = this.data.dialog.doNotShowAgain.showOption;
		}
	}

	/**
	 * changes the status to do not show again for specific dialog when value of checkbox is true.
	 */
	public onDontShowAgain() {
		// TODO: revise; store selected value in dialog model!
		/*if (typeof this.data.dialog.modalOptions.dontShowAgain === 'object') {
			this.data.dialog.modalOptions.dontShowAgain.activated = this.isChecked;
		}*/
	}
}
