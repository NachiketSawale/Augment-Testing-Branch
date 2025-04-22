/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropDataBase } from './drag-drop-data-base.interface';


/**
 * Platform interface representing information about the data being dragged in a drag-and-drop operation.
 *
 * @template S - The type of the source objects being dragged.
 */
export interface IDraggedDataInfo<S extends object> extends IDragDropDataBase<S>{
	// instance: ISlickGrid<S> // not sure if we need this later
}