/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { IEditorDialog, IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '../../base/index';
import { IInputDialogOptions } from '../model/input-dialog-options.interface';

import {
	INPUT_DLG_OPTIONS_TOKEN,
	ModalBodyInputComponent
} from '../components/modal-body-input/modal-body-input.component';

/**
 * This service displays dialogs useful to input a single text.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonInputDialogService {

	private readonly dialogSvc = inject(UiCommonDialogService);

	/**
	 * A standard dialog for input.
	 *
	 * @param {IInputDialogOptions} options Default dialog options.
	 * @returns Result of the dialog.
	 */
	// TODO: possibly modify options interface to not contain buttons
	public showInputDialog(options: IInputDialogOptions): Promise<IEditorDialogResult<string>> | undefined {
		const customModalOptions = this.dialogSvc.createOptionsForCustom<IEditorDialog<string>, IInputDialogOptions, string, ModalBodyInputComponent>(
			options,
			info => info.body.dialogInfo,
			ModalBodyInputComponent,
			[{
				provide: INPUT_DLG_OPTIONS_TOKEN,
				useValue: options
			}]
		);

		customModalOptions.windowClass = 'input-box';

		options.value ? options.value : Object.assign(options, { value: options.value ?? '' });

		customModalOptions.buttons = [
			{
				id: StandardDialogButtonId.Ok,
				isDisabled: (info) => {
					const val = info.dialog.value;
					if (val) {
						const pattern = options.pattern;
						const matchPattern = val.match(<string>pattern);
						if (matchPattern && matchPattern[0] !== val) {
							return true;
						} else {
							return val === '';
						}
					}
					return false;
				},
			},
			{
				id: StandardDialogButtonId.Cancel
			},
		];

		return this.dialogSvc.show(customModalOptions);
	}
}
