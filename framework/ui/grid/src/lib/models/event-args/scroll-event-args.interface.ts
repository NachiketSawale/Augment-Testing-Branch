/*
 * Copyright(c) RIB Software GmbH
 */


import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IScrollEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	scrollLeft: number;
	scrollTop: number;
}
