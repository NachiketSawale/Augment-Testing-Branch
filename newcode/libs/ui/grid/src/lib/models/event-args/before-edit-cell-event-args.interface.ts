/*
 * Copyright(c) RIB Software GmbH
 */

import { IRowCellEventArgs } from './row-cell-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface IBeforeEditCellEventArgs<T extends object> extends IRowCellEventArgs<T> {
	row: number;
	cell: number;
	item: unknown;
	column: ColumnDef<T>;
}

