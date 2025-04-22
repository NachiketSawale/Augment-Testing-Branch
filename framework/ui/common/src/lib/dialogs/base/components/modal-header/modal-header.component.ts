/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Translatable } from '@libs/platform/common';

import { IDialogHeaderModel } from '../../model/interfaces/dialog-header-model.interface';

/**
 * Component renders the header of dialog and implements the header basic functionality.
 */
@Component({
	selector: 'ui-common-modal-header',
	templateUrl: './modal-header.component.html',
	styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {

	public readonly data: {
		dialog:IDialogHeaderModel
	} = inject(MAT_DIALOG_DATA);

	/**
	 * Dialog header title.
	 */
	public get title(): Translatable {
		return this.data.dialog.headerText ?? '';
	}

	public get showCloseButton(): boolean {
		return typeof this.data.dialog.showCloseButton === 'boolean' ? this.data.dialog.showCloseButton : true;
	}
}
