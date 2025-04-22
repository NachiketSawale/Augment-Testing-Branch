/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialogOptions } from './dialog-options.interface';
import { IEditorDialog } from './editor-dialog.interface';

/**
 * The common interface for dialog options for dialogs that allow to
 * edit an object.
 *
 * @typeParam TValue The type of the value being edited in the dialog box.
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TDetailsBody The type of the component shown in the details area if
 *   any, otherwise `void`.
 *
 * @group Dialog Framework
 */
export interface IEditorDialogOptions<TValue, TDialog extends IEditorDialog<TValue, TDetailsBody>, TDetailsBody = void> extends IDialogOptions<TDialog, TDetailsBody> {

	/**
	 * Used to get value of dialog.
	 */
	value?: TValue;
}
