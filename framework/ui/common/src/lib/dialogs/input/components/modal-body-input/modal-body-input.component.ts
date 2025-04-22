/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';

import { IEditorDialog, StandardDialogButtonId } from '../../../base';

import { IInputDialogOptions } from '../../model/input-dialog-options.interface';
import { getCustomDialogDataToken } from '../../../base/model/interfaces/custom-dialog.interface';

export const INPUT_DLG_OPTIONS_TOKEN = new InjectionToken<IInputDialogOptions>('input-dlg-options');

/**
 * Component renders the Input dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-modal-body-input',
	templateUrl: './modal-body-input.component.html',
	styleUrls: ['./modal-body-input.component.scss'],
})
export class ModalBodyInputComponent {

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: ModalBodyInputComponent): IEditorDialog<string> {
			return {
				get value(): string | undefined {
					return owner.dialogWrapper.value;
				},
				set value(v: string) {
					owner.dialogWrapper.value = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				}
			};
		})(this);
	}

	/**
	 * The full options object for the input dialog.
	 */
	public readonly inputDialogOptions = inject(INPUT_DLG_OPTIONS_TOKEN);

	public readonly dialogInfo: IEditorDialog<string>;

	private readonly dialogWrapper = inject(getCustomDialogDataToken<string, ModalBodyInputComponent>());

	public get value(): string {
		return this.dialogWrapper.value ?? '';
	}

	public set value(v: string) {
		this.dialogWrapper.value = v;
	}

	/**
	 * Function validates the input data.
	 *
	 * @param {string} inputText Data entered in input field.
	 * @param {string} patternRegex Validation pattern.
	 * @returns {boolean} Is valid.
	 */
	public inputDialogValidation(inputText: string, patternRegex?: string): boolean {
		const text = inputText;
		const pattern = patternRegex ? patternRegex : '';
		const matchPattern = text.match(pattern);

		return matchPattern && matchPattern[0] !== text && patternRegex ? true : false;
	}
}
