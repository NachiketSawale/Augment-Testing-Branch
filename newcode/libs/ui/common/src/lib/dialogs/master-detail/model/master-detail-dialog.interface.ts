/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialog } from '../../base';
import { IMasterDetailItem } from './master-detail-item.interface';

/**
 * The interface for the runtime reference to a master-detail dialog.
 *
 * @typeParam TValue The type edited in the master-detail dialog box.
 *
 * @group Dialogs
 */
export interface IMasterDetailDialog<TValue extends object> extends IDialog {
	/**
	 * Gets or sets the zero-based index of the active item in the master-detail
	 * dialog box.
	 */
	activeItemIndex?: number;

	/**
	 * The current list of item definitions in the master-detail dialog box.
	 */
	items?: IMasterDetailItem<TValue>[];
}
