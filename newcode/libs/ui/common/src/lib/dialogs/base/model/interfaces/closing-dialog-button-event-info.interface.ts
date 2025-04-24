/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IDialog,
	IDialogButtonEventInfo,
	IClosingDialogEventInfo
} from '../..';

/**
 * Event information interface.
 *
 * @group Dialog Framework
 */
export interface IClosingDialogButtonEventInfo<TDialog extends IDialog<TDetailsBody>, TDetailsBody> extends IClosingDialogEventInfo<TDialog, TDetailsBody>, IDialogButtonEventInfo<TDialog, TDetailsBody> {
}
