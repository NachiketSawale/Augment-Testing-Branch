/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface ICellChangeEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	row: number;
	cell: number;
	item: T;
	column: ColumnDef<T>;
}
