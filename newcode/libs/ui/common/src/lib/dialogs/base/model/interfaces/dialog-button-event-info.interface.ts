/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IButtonInfo,
	IDialog,
	IDialogEventInfo
} from '../..';

/**
 * Event information interface.
 *
 * @group Dialog Framework
 */
export interface IDialogButtonEventInfo<TDialog extends IDialog<TDetailsBody>, TDetailsBody> extends IDialogEventInfo<TDialog, TDetailsBody> {

	/**
	 * A reference to the button the event was fired for.
	 */
	readonly button: IButtonInfo;
}
