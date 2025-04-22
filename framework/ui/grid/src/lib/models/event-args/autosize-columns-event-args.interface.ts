/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef } from '@libs/ui/common';
import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IAutosizeColumnsEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	columns: ColumnDef<T>[];
}
