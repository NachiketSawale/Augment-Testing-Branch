/*
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnDef } from './column-def.type';
import { IGridConfiguration } from './grid-configuration.interface';
import { TreeNodeEvent } from './events/tree-node-event.class';
import { IFieldValueChangeInfo } from '../../model/fields';
import { MouseEvent } from './events/grid-mouse-event.class';
import { CellChangeEvent } from './events/cell-change-event.class';
import { IDraggedDataInfo } from '@libs/platform/common';

/**
 * Interface for Grid API
 */
export interface IGridApi<T extends object> {

	/**
	 * Columns available to the grid
	 */
	columns: ColumnDef<T>[];

	/**
	 * Hidden columns which are not shown in the grid
	 */
	readonly hiddenColumns: ColumnDef<T>[];

	/**
	 * Columns which are visible in the grid
	 */
	readonly visibleColumns: ColumnDef<T>[];

	/**
	 * Method to update column/columns in the grid
	 * @param fields object or array of objects of IField types
	 */
	updateColumns(fields: ColumnDef<T> | ColumnDef<T>[]): void;

	/**
	 * Method to scroll row containing item into view
	 * @param item object
	 * @param forceEdit boolean. If true, forces the row into edit mode
	 */
	scrollRowIntoViewByItem(item: T, forceEdit: boolean): void;

	/**
	 * Retrieves or sets the current selection
	 */
	selection: Array<T>

	/**
	 * Retrieves or sets the last selected item
	 */
	entity: T | undefined;

	/**
	 * Retrieves or sets items in the grid
	 * @param items list of items to display in the grid
	 */
	items: T[];

	/**
	 * Method to show/hide the column search row in the grid
	 */
	columnSearch(): void;

	/**
	 * Method to show/hide the standard search panel in the grid
	 */
	searchPanel(): void;

	/**
	 * Method to show/hide the group panel in the grid
	 */
	groupPanel(): void;

	/**
	 * Tree method to expand the node provided
	 * @param node
	 */
	expand(node: T): void;

	/**
	 * Tree method to collapse the node provided
	 * @param node
	 */
	collapse(node: T): void;

	/**
	 * Tree method to expand all nodes in grid
	 */
	expandAll(level?: number): void;

	/**
	 * Tree method to collapse all nodes in grid
	 */
	collapseAll(): void;

	/**
	 * Method to resize grid
	 */
	resizeGrid(): void;

	/**
	 * Highlight rows
	 */
	highlightRows(row: number[]): void;

	/**
	 * Clear highlight row
	 */
	clearHighlightRow(): void;

	/**
	 * Returns the maximum tree level
	 */
	getMaxTreeLevel(): number

	/**
	 * Invalidates single/multiple data items or the complete grid
	 * Updates the UI for given items (grid rows) or whole grid
	 * @param items optional list of items to be invalidated otherwise invalidate whole grid
	 */
	invalidate(items?: T | T[]): void;

	/**
	 * Executes an internal refresh and optionally invalidates the grid
	 * @param invalidate optional, if true an invalidate is executed as well
	 */
	refresh(invalidate?: boolean): void;

	/**
	 * Event triggered when selection in the grid changes
	 */
	readonly selectionChanged: EventEmitter<T[]>;

	/**
	 * Event triggered when the items in the grid changes
	 */
	readonly itemsChanged: EventEmitter<T[]>

	/**
	 * Event triggered when subscribed or status changed
	 * True: if grid has been initialized
	 */
	readonly initialized: BehaviorSubject<boolean>;

	/**
	 * Current grid configuration
	 */
	configuration: IGridConfiguration<T>;

	/**
	 * Event triggered when subscribed or configuration changed
	 * Provides latest grid configuration
	 */
	readonly configurationChanged: BehaviorSubject<IGridConfiguration<T>>;

	/**
	 * Event triggered when a tree node is collapsing or expanding
	 */
	readonly treeNodeChanging: EventEmitter<TreeNodeEvent<T>>;

	/**
	 * Event triggered when a tree node has been collapsed or expanded
	 */
	readonly treeNodeChanged: EventEmitter<TreeNodeEvent<T>>;

	/**
	 * Event triggered when a property of an entity has been changed
	 */
	readonly valueChanged: EventEmitter<IFieldValueChangeInfo<T>>;

	/**
	 * Event triggered when the number of levels of the tree changes due to the
	 * adding/deleting of elements
	 */
	readonly treeLevelChanged: EventEmitter<number>;

	/**
	 * Event triggered when click in the grid occurs
	 */
	readonly mouseClick: EventEmitter<MouseEvent<T>>

	/**
	 * Event triggered when the mouse enters the grid cell
	 */
	readonly mouseEnter: EventEmitter<MouseEvent<T>>

	/**
	 * Event triggered when the mouse leaves the grid cell
	 */
	readonly mouseLeave: EventEmitter<MouseEvent<T>>

	/**
	 * Event trigger when mouse double clicks in grid
	 */
	readonly doubleClick: EventEmitter<MouseEvent<T>>

	/**
	 * Event triggered when a cell change occurs
	 */
	readonly cellChanged: EventEmitter<CellChangeEvent<T>>

	/**
	 * Event trigger when mouse drag starts in grid
	 */
	readonly dragStart: EventEmitter<IDraggedDataInfo<T>>

	/**
	 * Event trigger when mouse drag ends in grid
	 */
	readonly dragEnd: EventEmitter<IDraggedDataInfo<T>>

	/**
	 * Callback to provide grid api of host component
	 * Don't call from application code!
	 * @param gridHostApi
	 */
	hostInitialized(gridHostApi: IGridApi<T>): void;
}