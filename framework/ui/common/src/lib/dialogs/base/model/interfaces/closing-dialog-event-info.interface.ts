/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialog } from './dialog.interface';
import { IDialogEventInfo } from './dialog-event-info.interface';

/**
 * Event information interface.
 *
 * @group Dialog Framework
 */
export interface IClosingDialogEventInfo<TDialog extends IDialog<TDetailsBody>, TDetailsBody> extends IDialogEventInfo<TDialog, TDetailsBody> {

	/**
	 * If the dialog box is about to be closed by the current operation, setting this property to
	 * `false` will cancel the operation.
	 */
	cancel: boolean;
}
