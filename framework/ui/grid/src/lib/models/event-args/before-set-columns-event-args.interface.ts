/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface IBeforeSetColumnsEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	previousColumns: ColumnDef<T>[];
	newColumns: ColumnDef<T>[];
}
