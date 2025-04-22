/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IDialogResult, UiCommonDialogService } from '../../base';
import { ITabbedDialogOptions } from '../model/tabbed-dialog-options.interface';
import { TabbedDialogComponent } from '../components/tabbed-dialog/tabbed-dialog.component';
import { getTabbedDialogOptionsToken } from '../model/tabbed-dialog-options.interface';

@Injectable({
	providedIn: 'root',
})
export class UiCommonTabbedDialogService {
	private readonly dialogSvc = inject(UiCommonDialogService);

	/**
	 * Shows the tabbed dialog
	 * @param options
	 */
	public showDialog(options: ITabbedDialogOptions) : Promise<IDialogResult> | undefined {
		const dialogOptions = this.dialogSvc.createOptionsForCustom(options,
			dialog => dialog.body.dialogInfo,
			TabbedDialogComponent, [{
				provide: getTabbedDialogOptionsToken(),
				useValue: options
			}]
		);

		return this.dialogSvc.show(dialogOptions);
	}
}