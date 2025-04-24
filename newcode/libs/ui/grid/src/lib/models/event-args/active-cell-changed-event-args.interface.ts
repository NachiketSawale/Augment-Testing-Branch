/*
 * Copyright(c) RIB Software GmbH
 */

import { IRowCellEventArgs } from './row-cell-event-args.interface';

export interface IActiveCellChangedEventArgs<T extends object> extends IRowCellEventArgs<T> {
	cell: number;
	row: number;
}
