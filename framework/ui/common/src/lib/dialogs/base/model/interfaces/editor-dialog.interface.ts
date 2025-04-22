/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialog } from './dialog.interface';

/**
 * This is the base interface for an instance of a dialog box that can be used to edit a value.
 *
 * @typeParam TValue The type of the value being edited in the dialog box.
 * @typeParam TDetailsBody The type of the component shown in the details area if
 *   any, otherwise `void`.
 *
 * @group Dialog Framework
 */
export interface IEditorDialog<TValue, TDetailsBody = void> extends IDialog<TDetailsBody> {

	/**
	 * Gets or sets the current value being edited in the dialog box.
	 */
	value?: TValue;
}