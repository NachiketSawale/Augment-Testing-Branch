/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteDialogDetailOptions } from './dialog-detail-options.type';

/**
 * Additional options for dialogs that support a details area.
 *
 * @group Dialog Framework
 */
export interface IDialogDetailOptionsExtension<TDetailsBody> {

	/**
	 * Optional settings for a details area in the dialog box.
	 */
	readonly details?: ConcreteDialogDetailOptions<TDetailsBody>;
}