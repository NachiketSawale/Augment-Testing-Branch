/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface IHeaderClickEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	column: ColumnDef<T>;
}
