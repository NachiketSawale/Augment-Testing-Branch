/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IDblClickEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	row: number;
	cell: number;
}

