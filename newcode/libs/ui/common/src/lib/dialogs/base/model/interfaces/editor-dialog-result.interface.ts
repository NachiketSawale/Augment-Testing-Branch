/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialogResult } from './dialog-result.interface';

/**
 * The result of a dialog box in which a value could be edited.
 *
 * @typeParam TValue The type of the value being edited in the dialog box.
 *
 * @group Dialog Framework
 */
export interface IEditorDialogResult<TValue> extends IDialogResult {

	/**
	 * The payload of the dialog.
	 */
	readonly value?: TValue;
}