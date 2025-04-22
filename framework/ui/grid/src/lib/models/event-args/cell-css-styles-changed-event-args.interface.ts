/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface ICellCssStylesChangedEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	key: string;
	hash: string;
}
