/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { getCustomDialogDataToken, IDialog, StandardDialogButtonId } from '../../../base';
import { LONG_TEXT_DIALOG_BOX_OPTIONS } from '../../model/long-text-dialog-options.interface';

/**
 * Component renders the long text dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-long-text-dialog',
	templateUrl: './long-text-dialog.component.html',
	styleUrl: './long-text-dialog.component.scss',
})
export class LongTextDialogComponent {
	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo: IDialog;

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<void, LongTextDialogComponent>());

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(LONG_TEXT_DIALOG_BOX_OPTIONS);

	public constructor() {
		this.dialogInfo = (function createWrapper(owner: LongTextDialogComponent) {
			return {
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				},
			};
		})(this);
	}

	/**
	 * Returns current text to be displayed.
	 */
	public get text(): string {
		return this.dialogData.text;
	}

	/**
	 * Returns display type.
	 */
	public get type() {
		return this.dialogData.type;
	}
}
