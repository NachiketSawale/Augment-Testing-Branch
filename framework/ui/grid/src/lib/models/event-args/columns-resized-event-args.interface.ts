/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IColumnsResizedEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	triggeredByColumn: string;
}

