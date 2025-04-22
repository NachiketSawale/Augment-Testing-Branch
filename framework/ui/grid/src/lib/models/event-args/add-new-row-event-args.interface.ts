/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface IAddNewRowEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	item: unknown;
	column: ColumnDef<T>;
}

