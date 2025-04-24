/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';

import { getCustomDialogDataToken, IDialog, StandardDialogButtonId } from '../../../base';
import { PAGEABLE_DIALOG_BOX_OPTIONS } from '../../model/interfaces/pageable-long-text-dialog-options.interface';

/**
 * Component renders the pageable long text dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-pageable-long-text-dialog',
	templateUrl: './pageable-long-text-dialog.component.html',
	styleUrl: './pageable-long-text-dialog.component.scss',
})
export class PageableLongTextDialogComponent {
	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo: IDialog;

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<void, PageableLongTextDialogComponent>());

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(PAGEABLE_DIALOG_BOX_OPTIONS);

	public constructor() {
		this.dialogInfo = (function createWrapper(owner: PageableLongTextDialogComponent) {
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
		return this.dialogData.dataSource.currentText;
	}

	/**
	 * Returns display type.
	 */
	public get type() {
		return this.dialogData.type;
	}
}
