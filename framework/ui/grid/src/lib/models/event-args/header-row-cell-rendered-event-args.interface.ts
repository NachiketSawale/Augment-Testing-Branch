/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ISlickColumn } from '../slick-grid/slick-column.interface';

export interface IHeaderRowCellRenderedEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	node: HTMLDivElement;
	column: ISlickColumn;
}
