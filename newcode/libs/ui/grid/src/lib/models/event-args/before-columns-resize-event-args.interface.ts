/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IBeforeColumnsResizeEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	triggeredByColumn: string;
}

