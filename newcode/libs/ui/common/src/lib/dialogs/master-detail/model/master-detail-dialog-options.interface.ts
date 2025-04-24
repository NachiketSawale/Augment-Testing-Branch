/*
 * Copyright(c) RIB Software GmbH
 */

import { IDialogOptions } from '../..';
import { IMasterDetailDialog } from '..';
import { IMasterDetailDialogData } from './master-detail-dialog-data.interface';

/**
 * The options interface for a master-detail dialog box.
 *
 * @typeParam TValue The type edited in the master-detail dialog box.
 *
 * @group Dialogs
 */
export interface IMasterDetailDialogOptions<TValue extends object> extends IMasterDetailDialogData<TValue>, IDialogOptions<IMasterDetailDialog<TValue>> {
}
