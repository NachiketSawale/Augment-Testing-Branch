/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IDialog,
	IDialogOptions
} from '../../base';

/**
 * Yes/No dialog options interface.
 *
 * @group Dialogs
 */
export interface IYesNoDialogOptions extends IDialogOptions<IDialog> {

	/**
	 * The text in the body area of the dialog.
	 */
	bodyText?: string;

	/**
	 * Boolean indicating whether cancel button is displayed or not.
	 */
	showCancelButton?: boolean;
}
