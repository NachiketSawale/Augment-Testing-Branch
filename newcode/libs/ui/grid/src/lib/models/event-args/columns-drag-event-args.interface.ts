/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IColumnsDragEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	triggeredByColumn: string;
	resizeHandle: HTMLDivElement;
}
