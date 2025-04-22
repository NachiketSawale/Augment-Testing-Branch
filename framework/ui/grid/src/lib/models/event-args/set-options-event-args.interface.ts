/*
 * Copyright(c) RIB Software GmbH
 */


import { ISlickGridEventArgs } from './slick-grid-event-args.interface';
import { ISlickGridOptions } from '../slick-grid/slick-grid-options.interface';

export interface ISetOptionsEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	optionsBefore: ISlickGridOptions<T>;
	optionsAfter: ISlickGridOptions<T>;
}
