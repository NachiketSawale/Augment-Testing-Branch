/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IRowsChanged<T extends object> extends ISlickGridEventArgs<T> {
	rows: number[];
}