/*
 * Copyright(c) RIB Software GmbH
 */

import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Dialog result data interface.
 *
 * @group Dialog Framework
 */
export interface IDialogResult {

	/**
	 * Returns the ID of the button used to close the dialog box.
	 */
	readonly closingButtonId: StandardDialogButtonId | string;
}
