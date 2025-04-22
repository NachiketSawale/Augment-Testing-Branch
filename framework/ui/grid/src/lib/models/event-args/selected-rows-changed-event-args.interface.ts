/*
 * Copyright(c) RIB Software GmbH
 */


import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface ISelectedRowsChangedEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	rows: number[];
	previousSelectedRows: number[];
	changedSelectedRows: number[];
	changedUnselectedRows: number[];
	caller: string;
}
