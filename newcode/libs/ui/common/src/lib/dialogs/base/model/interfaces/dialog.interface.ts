/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialogDetails } from './dialog-details.interface';
import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * This is the base interface for an instance of a dialog box.
 *
 * @group Dialog Framework
 */
export interface IDialog<TDetailsBody = void> {

	/**
	 * The details area of the dialog, if any.
	 */
	readonly details?: IDialogDetails<TDetailsBody>;

	/**
	 * Closes the dialog box.
	 *
	 * @param closingButtonId The ID of the button that should be returned. Even though this
	 *   close action may not happen as the result of a button click, this Id can be used to
	 *   indicate the operations that should take place after the dialog has been closed.
	 *   If `undefined` is passed, the dialog's default button, or else `'cancel'`, will be
	 *   returned.
	 */
	close(closingButtonId?: StandardDialogButtonId | string): void;
}