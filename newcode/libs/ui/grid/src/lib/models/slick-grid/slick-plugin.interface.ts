/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGrid } from "./slick-grid.interface";

export interface ISlickPlugin<T extends object>{
	init(grid: ISlickGrid<T>): void;
	destroy(): void;
}
