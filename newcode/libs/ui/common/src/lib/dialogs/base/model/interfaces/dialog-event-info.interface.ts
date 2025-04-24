/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialog } from './dialog.interface';

/**
 * Event information interface.
 *
 * @group Dialog Framework
 */
export interface IDialogEventInfo<TDialog extends IDialog<TDetailsBody>, TDetailsBody = void> {

	/**
	 * A reference to the dialog box.
	 */
	readonly dialog: TDialog;
}
