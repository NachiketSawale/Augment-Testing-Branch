/*
 * Copyright(c) RIB Software GmbH
 */
import { set } from 'lodash';
import { inject, Injectable } from '@angular/core';

import { LongTextDialogComponent } from '../components/long-text-dialog/long-text-dialog.component';

import { ILongTextDialogOptions, LONG_TEXT_DIALOG_BOX_OPTIONS } from '../model/long-text-dialog-options.interface';
import { ICustomDialog, IDialogButtonBase, IDialogButtonEventInfo, IDialogResult, UiCommonDialogService } from '../../base';

/**
 * This service displays long text modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonLongTextDialogService {
	/**
	 * Opens/Closes dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Displays long text dialog.
	 *
	 * @param options long text options.
	 * @returns Dialog result.
	 */
	public show(options: ILongTextDialogOptions): Promise<IDialogResult> | undefined {
		const dialogOptions = this.modalDialogService.createOptionsForCustom(options, 
			(dlg) => dlg.body.dialogInfo, 
			LongTextDialogComponent, 
			[{
				provide: LONG_TEXT_DIALOG_BOX_OPTIONS,
				useValue: options,
			}],
		);

		dialogOptions.windowClass = 'longtext-dialog';
		dialogOptions.customButtons = this.getCustomButtons(options).concat(dialogOptions.customButtons ?? []);
		dialogOptions.width = dialogOptions.width ? dialogOptions.width : '50%';
		dialogOptions.height = dialogOptions.height ? dialogOptions.height : '50%';

		return this.modalDialogService.show(dialogOptions);
	}

	/**
	 * Method returns the custom buttons for the dialog.
	 *
	 * @param options Dialog options.
	 * @returns Custom buttons.
	 */
	private getCustomButtons(options: ILongTextDialogOptions): Array<IDialogButtonBase<ICustomDialog<void, LongTextDialogComponent, void>, void>> {
		const buttons = [];

		//Copy to clipboard button.
		buttons.push(this.getCopyToClipBoardButton(options));

		return buttons;
	}

	/**
	 * Method returns the copy button for the dialog.
	 *
	 * @param options Dialog options.
	 * @returns Copy to clipboard button.
	 */
	private getCopyToClipBoardButton(options: ILongTextDialogOptions): IDialogButtonBase<ICustomDialog<void, LongTextDialogComponent, void>, void> {
		//TODO: Below implementation is just the demo will be modified when copy button available.
		return this.modalDialogService['createCopyToClipboardButton'](
			() => {
				return options.text;
			},
			{
				processSuccess: (info: IDialogButtonEventInfo<ICustomDialog<void, LongTextDialogComponent, void>, void>, msgKey: string) => {
					set(info.dialog, 'alarm', msgKey);
				},
			},
		);
	}
}
