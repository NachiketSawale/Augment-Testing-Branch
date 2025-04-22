/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ColumnDef } from '@libs/ui/common';

export interface IBeforeFooterRowCellDestroyEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	node: HTMLElement;
	column: ColumnDef<T>;
}
