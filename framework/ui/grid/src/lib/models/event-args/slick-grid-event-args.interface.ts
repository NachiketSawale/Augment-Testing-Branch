/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGrid } from '../slick-grid/slick-grid.interface';

export interface ISlickGridEventArgs<T extends object> {
	grid: ISlickGrid<T>;
}
