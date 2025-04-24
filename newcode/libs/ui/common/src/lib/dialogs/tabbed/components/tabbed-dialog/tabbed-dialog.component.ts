/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { getCustomDialogDataToken, IDialog, IDialogDetails, StandardDialogButtonId } from '../../../base';
import { getTabbedDialogOptionsToken } from '../../model/tabbed-dialog-options.interface';
import { ITabbedDialogTabConfig } from '../../model/tabbed-dialog-tab-config.interface';

@Component({
	selector: 'ui-common-tabbed-dialog',
	templateUrl: './tabbed-dialog.component.html',
	styleUrls: ['./tabbed-dialog.component.scss'],
})
export class TabbedDialogComponent {

	public constructor() {
		this.dialogInfo = (function createWrapper(owner: TabbedDialogComponent) {
			return {
				get details(): IDialogDetails {
					if (!owner.dialogWrapper.details) {
						throw new Error('No details wrapper available.');
					}

					return owner.dialogWrapper.details;
				},
				close(closeButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closeButtonId);
				}
			};
		})(this);
	}

	private readonly tabbedDialogOptions = inject(getTabbedDialogOptionsToken());

	private readonly dialogWrapper = inject(getCustomDialogDataToken<void, TabbedDialogComponent, void>());

	/**
	 * dialogInfo
	 */
	public readonly dialogInfo: IDialog;

	/**
	 * tab definitions for the tabbed dialog
	 */
	public getTabs() : ITabbedDialogTabConfig[] {
		return this.tabbedDialogOptions.tabs;
	}

}