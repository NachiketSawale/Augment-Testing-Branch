/*
 * Copyright(c) RIB Software GmbH
 */

import { ISlickGrid } from 'libs/ui/grid/src/lib/models/slick-grid/slick-grid.interface';
import { IGridColumnFilter } from "../grid-column-filter.interface";
import { ISlickEvent } from './slick-event.interface';
import { IRowsChanged } from '../event-args/rows-changed-event-args.interface';
import { ITreeLevelChanged } from '../event-args/tree-level-changed-event-args.interface';

export interface ISlickDataView<T extends object> {
   setItems(items: Array<object>): void;

   getItems(): Array<object>;

	getRows(): Array<object>;

   setGrid(grid: object): void;

   getItemCount(): number;

	getMaxTreeLevel(): number;

   sortTree(comparer: (i1: T, i2: T) => number, ascending: boolean): void;

   sort(comparer: (i1: T, i2: T) => number, sortColumn: { ascending?: boolean }): void;

   syncGridSelection(grid: ISlickGrid<T>, preserveHidden: boolean): void;

	toggleNode(node: T): void;

	refresh(): void;

	setFilterArgs(args: {}) : void;

	setFilter(filterFn: (item: T, args: {searchString: string, columnFilters: IGridColumnFilter[], customFilter: (item: T) => boolean, promises: []}, lookupCache: [])=> boolean): void;

	setColumnFilter(filterFn: (item: T, args: {columnFilters: IGridColumnFilter[], customFilter: (item: T) => boolean, promises: []}, lookupCache: [])=> boolean): void;

	expandNode(node: T): void;

	collapseNode(node: T): void;

	collapseAllNodes(): void;

	expandAllNodes(level?: number): void;

	onRowsChanged: ISlickEvent<IRowsChanged<T>>;

	onTreeLevelChanged: ISlickEvent<ITreeLevelChanged<T>>;

	getRowById(id: string | number): number;
}
