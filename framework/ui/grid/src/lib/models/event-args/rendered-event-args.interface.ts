/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IRenderedEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	startRow: number;
	endRow: number;
}
