/*
 * Copyright(c) RIB Software GmbH
 */

import { IRowCellEventArgs } from './row-cell-event-args.interface';

export interface IBeforeAppendCellEventArgs<T extends object> extends IRowCellEventArgs<T> {
	value: unknown;
	dataContext: unknown;
}
