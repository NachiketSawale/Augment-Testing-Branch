/*
 * Copyright(c) RIB Software GmbH
 */

import { IActiveCellChangedEventArgs } from '../event-args/active-cell-changed-event-args.interface';
import { IAddNewRowEventArgs } from '../event-args/add-new-row-event-args.interface';
import { IBeforeCellEditorDestroyEventArgs } from '../event-args/before-cell-editor-destroy-event-args.interface';
import { IBeforeEditCellEventArgs } from '../event-args/before-edit-cell-event-args.interface';
import { IBeforeHeaderRowCellDestroyEventArgs } from '../event-args/before-header-row-cell-destroy-event-args.interface';
import { ICellChangeEventArgs } from '../event-args/cell-change-event-args.interface';
import { IColumnsReorderedEventArgs } from '../event-args/columns-reordered-event-args.interface';
import { ISlickGridEventArgs } from '../event-args/slick-grid-event-args.interface';
import { ISlickCellBox, ISlickElementPosition } from './slick-cell-box.interface';
import { ISlickDataView } from './slick-data-view.interface';
import { ISlickEditorLock } from './slick-editor-lock.interface';
import { ISlickEditor } from './slick-editor.interface';
import { ISlickEvent } from './slick-event.interface';
import { ISlickGridOptions } from './slick-grid-options.interface';
import { ISlickPlugin } from './slick-plugin.interface';
import { SlickSelectionModel } from './slick-selection-model.enum';
import { IDblClickEventArgs } from '../event-args/dbl-click-event-args.interface';
import { IColumnsResizedEventArgs } from '../event-args/columns-resized-event-args.interface';
import { ISlickEventData } from './slick-event-data.interface';
import { IClickEventArgs } from '../event-args/click-event-args.interface';
import { ICellCssStylesChangedEventArgs } from '../event-args/cell-css-styles-changed-event-args.interface';
import { IBeforeHeaderCellDestroyEventArgs } from '../event-args/before-header-cell-destroy-event-args.interface';
import { IHeaderCellRenderedEventArgs } from '../event-args/header-cell-rendered-event-args.interface';
import { IHeaderClickEventArgs } from '../event-args/header-click-event-args.interface';
import { IHeaderContextMenuEventArgs } from '../event-args/header-context-menu-event-args.interface';
import { IHeaderMouseEventArgs } from '../event-args/header-mouse-event-args.interface';
import { IHeaderRowCellRenderedEventArgs } from '../event-args/header-row-cell-rendered-event-args.interface';
import { IKeyDownEventArgs } from '../event-args/key-down-event-args.interface';
import { IRenderedEventArgs } from '../event-args/rendered-event-args.interface';
import { IScrollEventArgs } from '../event-args/scroll-event-args.interface';
import { ISelectedRowsChangedEventArgs } from '../event-args/selected-rows-changed-event-args.interface';
import { ColumnDef } from '@libs/ui/common';
import { ISlickColumn } from './slick-column.interface';

export interface ISlickGrid <T extends object> {
	/**
	 * Register an external Plugin (addon)
	 */
	registerPlugin(plugin: ISlickPlugin<T>): void;

	/**
	 * Unregister an external Plugin (addon)
	 */
	unregisterPlugin(plugin: ISlickPlugin<T>): void;

	/**
	 * Checks if given plugin (addon) is registered
	 */
	hasPlugin(plugin: ISlickPlugin<T>): boolean;

	/**
	 * Returns an array of column definitions, containing the option settings for each individual column.
	 */
	getColumns(): ISlickColumn[];

	/**
	 * Sets grid columns. Column headers will be recreated and all rendered rows will be removed.
	 * To rerender the grid (if necessary), call render().
	 * @param columnDefinitions An array of column definitions.
	 */
	setColumns(columnDefinitions: ISlickColumn[]): void;

	/**
	 * Returns the index of a column with a given id.
	 * Since columns can be reordered by the user, this can be used to get the column definition independent of the order:
	 * @param id A column id.
	 */
	getColumnIndex(id: string | number): number;

	/**
	 * Updates an existing column definition and a corresponding header DOM element with the new title and tooltip.
	 * @param columnId Column id.
	 * @param title New column name.
	 * @param toolTip New column tooltip.
	 */
	updateColumnHeader(columnId: string | number, title?: string, toolTip?: string): void;

	/**
	 * Accepts a columnId string and an ascending boolean.
	 * Applies a sort glyph in either ascending or descending form to the header of the column.
	 * Note that this does not actually sort the column. It only adds the sort glyph to the header.
	 * @param columnId
	 * @param ascending
	 */
	setSortColumn(columnId: string | number, ascending: boolean): void;

	/**
	 * Accepts an array of objects in the form [ { columnId: [string], sortAsc: [boolean] }, ... ].
	 * When called, this will apply a sort glyph in either ascending or descending form to the header of each column specified in the array.
	 * Note that this does not actually sort the column. It only adds the sort glyph to the header
	 * @param cols
	 */
	setSortColumns(cols: Array<{ columnId: string | number; sortAsc: boolean; }>): void;

	/**
	 * Get sorted columns
	 */
	getSortColumns(): ISlickColumn[];

	/**
	 * Proportionately resizes all columns to fill available horizontal space.
	 * This does not take the cell contents into consideration.
	 */
	autosizeColumns(): void;

	/**
	 * Returns an object containing all the grid options set on the grid.
	 * See a list of Grid Options here.
	 */
	getOptions(): ISlickGridOptions<T>;

	/**
	 * Extends grid options with a given hash. If there is an active edit, the grid will attempt to commit the changes and only continue if the attempt succeeds.
	 * @param {Object} options - an object with configuration options.
	 */
	setOptions(options: ISlickGridOptions<T>): void;

	/**
	 * Returns an array of every data object, unless you're using DataView in which case it returns a DataView object.
	 */
	getData<V = ISlickDataView<T>>(): V;

	/**
	 * Returns the size of the databinding source.
	 */
	getDataLength(): number;

	/**
	 * Returns the databinding item at a given position.
	 * @param index Item row index.
	 */
	getDataItem<T = any>(index: number): T;

	/**
	 * Sets a new source for databinding and removes all rendered rows.
	 * Note that this doesn't render the new rows - you can follow it with a call to render() to do that.
	 * @param newData New databinding source using a regular JavaScript array or a custom object exposing getItem(index) and getLength() functions.
	 * @param scrollToTop If true, the grid will reset the vertical scroll position to the top of the grid.
	 */
	setData<T = any>(newData: T | T[], scrollToTop?: boolean): void;

	/**
	 * Returns the current SelectionModel. See here for more information about SelectionModels.
	 */
	getSelectionModel(): SlickSelectionModel;

	/**
	 * Unregisters a current selection model and registers a new one. See the definition of SelectionModel for more information.
	 * @selectionModel A SelectionModel.
	 */
	setSelectionModel(selectionModel: SlickSelectionModel): void;

	/** Returns an array of row indices corresponding to the currently selected rows. */
	getSelectedRows(): number[];

	/**
	 * Accepts an array of row indices and applies the current selectedCellCssClass to the cells in the row, respecting whether cells have been flagged as selectable.
	 * @param rowsArray - an array of row numbers.
	 * @param suppressNotification - set to true to not sending selectionChanged event
	 */
	setSelectedRows(rowsArray: number[], suppressNotification?: boolean): void;

	/**
	 * Get Grid Canvas Node DOM Element
	 */
	getContainerNode(): HTMLDivElement;

	/**
	 * (re)Render the grid
	 */
	render(): void;

	/**
	 * Invalidate all rows and re-render the grid rows
	 */
	invalidate(): void;

	/**
	 * Invalidate all rows
	 */
	invalidateAllRows(): void;

	/**
	 * Invalidate a specific row number
	 */
	invalidateRow(row: number): void;

	/**
	 * Invalidate a specific set of row numbers
	 */
	invalidateRows(rows: number[]): void;

	/**
	 * Update a specific cell by its row and column index
	 */
	updateCell(row: number, cell: number): void;

	/**
	 * Update a specific row by its row index
	 */
	updateRow(row: number): void;

	/**
	 * Get Viewport position
	 */
	getViewport(viewportTop?: number, viewportLeft?: number): { top: number; bottom: number; leftPx: number; rightPx: number; };

	/**
	 * Get rendered range
	 */
	getRenderedRange(viewportTop?: number, viewportLeft?: number): { top: number; bottom: number; leftPx: number; rightPx: number; };

	/**
	 * Execute a Resize of the Canvas
	 */
	resizeCanvas(): void;

	/**
	 * Update the dataset row count
	 */
	updateRowCount(): void;

	/**
	 * Scroll to a specific row and make it into the view
	 */
	scrollRowIntoView(row: number, doPaging?: boolean): void;

	/**
	 * Scroll to the top row and make it into the view
	 */
	scrollRowToTop(row: number): void;

	/**
	 * Scroll to a specific cell and make it into the view
	 */
	scrollCellIntoView(row: number, cell: number, doPaging?: boolean): void;

	/**
	 * Get Grid Canvas Node DOM Element
	 */
	getCanvasNode(): HTMLElement;

	/**
	 * Get the canvas DOM element
	 */
	getCanvases(): HTMLDivElement;

	/**
	 * Get the canvas DOM element
	 */
	getActiveCanvasNode(element?: HTMLElement): HTMLElement;

	/**
	 * Sets an active canvas node
	 */
	setActiveCanvasNode(element: HTMLDivElement): void;

	/**
	 * Get the Viewport DOM node element
	 */
	getViewportNode(): HTMLDivElement;

	/**
	 * Get the active Viewport DOM node element
	 */
	getActiveViewportNode(element?: HTMLElement): HTMLDivElement;

	/**
	 * Sets an active viewport node
	 */
	setActiveViewportNode(element: HTMLDivElement): void;

	/**
	 * Set focus
	 */
	focus(): void;

	/**
	 * combines gotoCell + focus into one call
	 */
	setCellFocus(row: number, cell: number, forceEdit?: boolean): void;

	/**
	 * Returns a hash containing row and cell indexes.
	 * Coordinates are relative to the top left corner of the grid beginning with the first row (not including the column headers).
	 * @param x An x coordinate.
	 * @param y A y coordinate.
	 */
	getCellFromPoint(x: number, y: number): { cell: number; row: number; };

	/**
	 * Returns a hash containing row and cell indexes from a standard W3C/jQuery event.
	 * @param e A standard W3C/jQuery event.
	 */
	getCellFromEvent(e: Event): { cell: number; row: number; } | null;

	/**
	 * Returns an object representing the coordinates of the currently active cell:
	 * @example
	 * 	{
	 * 	  row: activeRow,
	 * 	  cell: activeCell
	 * 	}
	 */
	getActiveCell(): { row: number; cell: number; };

	/**
	 * Sets an active cell.
	 * @param {number} row - A row index.
	 * @param {number} cell - A column index.
	 */
	setActiveCell(row: number, cell: number): void;

	/**
	 * Returns the DOM element containing the currently active cell. If no cell is active, null is returned.
	 */
	getActiveCellNode(): HTMLDivElement;

	/**
	 * Returns an object representing information about the active cell's position.
	 * All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
	 */
	getActiveCellPosition(): ISlickElementPosition;

	/**
	 * Resets active cell.
	 */
	resetActiveCell(): void;

	/**
	 * Attempts to switch the active cell into edit mode. Will throw an error if the cell is set to be not editable.
	 * Uses the specified editor, otherwise defaults to any default editor for that given cell.
	 * @param {object} editor - A SlickGrid editor.
	 */
	editActiveCell(editor: ISlickEditor): void;

	/**
	 * Returns the active cell editor.
	 * If there is no actively edited cell, null is returned.
	 */
	getCellEditor(): ISlickEditor | null;

	/**
	 * Returns a DOM element containing a cell at a given row and cell.
	 * @param row A row index.
	 * @param cell A column index.
	 */
	getCellNode(row: number, cell: number): HTMLDivElement;

	/**
	 * Returns an object representing information about a cell's position.
	 * All coordinates are absolute and take into consideration the visibility and scrolling position of all ancestors.
	 * @param row A row index.
	 * @param cell A column index.
	 */
	getCellNodeBox(row: number, cell: number): ISlickElementPosition;

	/**
	 * Returns true if selecting the row causes this particular cell to have the selectedCellCssClass applied to it.
	 * A cell can be selected if it exists and if it isn't on an empty / "Add New" row and if it is not marked as "unselectable" in the column definition.
	 * @param {number} row A row index.
	 * @param {number} col A column index.
	 */
	canCellBeSelected(row: number, col: number): boolean;

	/**
	 * Returns true if you can click on a given cell and make it the active focus.
	 * @param {number} row A row index.
	 * @param {number} col A column index.
	 */
	canCellBeActive(row: number, col: number): boolean;

	/**
	 * Switches the active cell one row down skipping unselectable cells.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigateDown(): boolean;

	/** Switches the active cell one cell left skipping unselectable cells.
	 * Unline navigatePrev, navigateLeft stops at the first cell of the row.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigateLeft(): boolean;

	/**
	 * Tabs over active cell to the next selectable cell.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigateNext(): boolean;

	/**
	 * Navigate (scroll) by a page up
	 */
	navigatePageUp(): void;

	/**
	 * Navigate (scroll) by a page down
	 */
	navigatePageDown(): void;

	/**
	 * Tabs over active cell to the previous selectable cell.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigatePrev(): boolean;

	/**
	 * Switches the active cell one cell right skipping unselectable cells.
	 * Unline navigateNext, navigateRight stops at the last cell of the row.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigateRight(): boolean;

	/**
	 * Switches the active cell one row up skipping unselectable cells.
	 * Returns a boolean saying whether it was able to complete or not.
	 */
	navigateUp(): boolean;

	/**
	 * Accepts a row integer and a cell integer, scrolling the view to the row where row is its row index, and cell is its cell index.
	 * Optionally accepts a forceEdit boolean which, if true, will attempt to initiate the edit dialogue for the field in the specified cell.
	 * Unlike setActiveCell, this scrolls the row into the viewport and sets the keyboard focus.
	 * @param row A row index.
	 * @param cell A column index.
	 * @param forceEdit If true, will attempt to initiate the edit dialogue for the field in the specified cell.
	 */
	gotoCell(row: number, cell: number, forceEdit?: boolean): void;

	/**
	 * Get Top Panel DOM element
	 */
	getTopPanel(): HTMLDivElement;

	/**
	 * Get the Filter Header Row DOM element
	 */
	getHeaderRowScroller(): HTMLDivElement;

	/**
	 * Get the Header Row DOM element
	 */
	getHeaderRow(): HTMLDivElement;

	/**
	 * Get Header Row Column DOM element by its column Id
	 */
	getHeaderRowColumn(columnId: string | number): HTMLDivElement;

	/**
	 * Get the Grid Position
	 */
	getGridPosition(): ISlickElementPosition;

	/**
	 * Flashes the cell twice by toggling the CSS class 4 times.
	 * @param {number} row A row index.
	 * @param {number} cell A column index.
	 * @param {number} speed (optional) - The milliseconds delay between the toggling calls. Defaults to 100 ms.
	 */
	flashCell(row: number, cell: number, speed?: number): void;

	/**
	 * Adds an "overlay" of CSS classes to cell DOM elements.
	 * SlickGrid can have many such overlays associated with different keys and they are frequently used by plugins.
	 * For example, SlickGrid uses this method internally to decorate selected cells with selectedCellCssClass (see options).
	 * @param key A unique key you can use in calls to setCellCssStyles and removeCellCssStyles. If a hash with that key has already been set, an exception will be thrown.
	 * @param hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
	 * @example
	 * {
	 * 	0:    {
	 * 		number_column: SlickEvent;
	 * 		title_column: SlickEvent;
	 * 	},
	 * 	4:    {
	 * 		percent_column: SlickEvent;
	 * 	}
	 * }
	 */
	addCellCssStyles(key: string, hash: any): void;

	/**
	 * Sets CSS classes to specific grid cells by calling removeCellCssStyles(key) followed by addCellCssStyles(key, hash).
	 * Key is name for this set of styles so you can reference it later - to modify it or remove it, for example.
	 * Hash is a per-row-index, per-column-name nested hash of CSS classes to apply.
	 * Suppose you have a grid with columns:
	 * ["login", "name", "birthday", "age", "likes_icecream", "favorite_cake"]
	 * ...and you'd like to highlight the "birthday" and "age" columns for people whose birthday is today, in this case, rows at index 0 and 9.
	 * (The first and tenth row in the grid).
	 * @param key A string key. Will overwrite any data already associated with this key.
	 * @param hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
	 */
	setCellCssStyles(key: string, hash: any): void;

	/**
	 * Removes an "overlay" of CSS classes from cell DOM elements. See setCellCssStyles for more.
	 * @param key A string key.
	 */
	removeCellCssStyles(key: string): void;

	/**
	 * Accepts a key name, returns the group of CSS styles defined under that name. See setCellCssStyles for more info.
	 * @param key A string.
	 */
	getCellCssStyles(key: string): any;

	/**
	 * Get frozen (pinned) row offset
	 */
	getFrozenRowOffset(row: number): number;

	/**
	 * Initializes the grid.
	 * Called after plugins are registered.
	 * Normally, this is called by the constructor, so you don't need to call it.
	 * However, in certain cases you may need to delay the initialization until some other process has finished.
	 * In that case, set the explicitInitialization option to true and call the grid.init() manually.
	 */
	init(): void;

	/**
	 * Destroy (dispose) of SlickGrid
	 * @param {boolean} shouldDestroyAllElements - do we want to destroy (nullify) all DOM elements as well? This help in avoiding mem leaks
	 */
	destroy(shouldDestroyAllElements?: boolean): void;

	/**
	 * Get Editor lock
	 */
	getEditorLock(): ISlickEditorLock;

	/**
	 * Get Editor Controller
	 */
	getEditController(): {
		/** Commit Current Editor command */
		commitCurrentEdit(): boolean;

		/** Cancel Current Editor command */
		cancelCurrentEdit(): boolean;
	};

	// Events
	onActiveCellChanged: ISlickEvent<IActiveCellChangedEventArgs<T>>;
	onActiveCellPositionChanged: ISlickEvent<ISlickGridEventArgs<T>>;
	onAddNewRow: ISlickEvent<IAddNewRowEventArgs<T>>;
	onBeforeCellEditorDestroy: ISlickEvent<IBeforeCellEditorDestroyEventArgs<T>>;
	onBeforeDestroy: ISlickEvent<ISlickGridEventArgs<T>>;
	onBeforeEditCell: ISlickEvent<IBeforeEditCellEventArgs<T>>;
	onBeforeHeaderCellDestroy: ISlickEvent<IBeforeHeaderCellDestroyEventArgs<T>>;
	onBeforeHeaderRowCellDestroy: ISlickEvent<IBeforeHeaderRowCellDestroyEventArgs<T>>;
	onCellChange: ISlickEvent<ICellChangeEventArgs<T>>;
	onCellCssStylesChanged: ISlickEvent<ICellCssStylesChangedEventArgs<T>>;
	onClick: ISlickEvent<IClickEventArgs<T>>;
	onColumnsReordered: ISlickEvent<IColumnsReorderedEventArgs<T>>;
	onColumnsResized: ISlickEvent<IColumnsResizedEventArgs<T>>;
	onContextMenu: ISlickEvent<ISlickEventData>;
	onDblClick: ISlickEvent<IDblClickEventArgs<T>>;
	onDrag: ISlickEvent;
	onDragEnd: ISlickEvent;
	onDragInit: ISlickEvent;
	onDragStart: ISlickEvent;
	onHeaderCellRendered: ISlickEvent<IHeaderCellRenderedEventArgs<T>>;
	// onHeaderCheckboxChanged - not available in slickgrid universal
	onHeaderCheckboxChanged: ISlickEvent;
	onHeaderClick: ISlickEvent<IHeaderClickEventArgs<T>>;
	onHeaderContextMenu: ISlickEvent<IHeaderContextMenuEventArgs<T>>;
	onHeaderMouseEnter: ISlickEvent<IHeaderMouseEventArgs<T>>;
	onHeaderMouseLeave: ISlickEvent<IHeaderMouseEventArgs<T>>;
	onHeaderRowCellRendered: ISlickEvent<IHeaderRowCellRenderedEventArgs<T>>;
	onKeyDown: ISlickEvent<IKeyDownEventArgs<T>>;
	// onKeyUp - not available in slickgrid universal
	onKeyUp: ISlickEvent;
	onMouseEnter: ISlickEvent<ISlickEventData>;
	onMouseLeave: ISlickEvent<ISlickEventData>;
	// onRenderCompleted - not available in slickgrid universal, onRendered ???
	onRenderCompleted: ISlickEvent;
	onRendered: ISlickEvent<IRenderedEventArgs<T>>;
	onScroll: ISlickEvent<IScrollEventArgs<T>>;
	onSelectedRowsChanged: ISlickEvent<ISelectedRowsChangedEventArgs<T>>;
	onSort: ISlickEvent;
	onViewportChanged: ISlickEvent<ISlickEventData>;

	// RIB modifications / extensions
	/**
	 * Get grid unique identifier
	 */
	// todo: replace getUID(): string;
	getUuid(): string;

	getMainTopPanel(): HTMLElement;
	getHeaderElements(): HTMLElement[];
	getColumnHeaders(): HTMLElement[];
	setTopPanelVisibility(visible: boolean): void;
	topPanelVisibility(visible: boolean | undefined): boolean;

	// both functions are the same, mainTopPanelVisibility should be removed (to be checked)
	mainTopPanelVisibility(visible: boolean | undefined, searchString: string | undefined): boolean;
	searchPanelVisibility(visible: boolean | undefined, searchString: string | undefined): boolean;

	filterRowVisibility(visible: boolean | undefined): boolean;

	groupPanelVisibility(visible: boolean | undefined): boolean;

	setHeaderRowVisibility(visible: boolean): void;

	getViewportNodes(): HTMLElement[];

	getHeaders(): HTMLElement[];
	getHeaderLeft(): HTMLElement;
	getHeaderRight(): HTMLElement;
	getHeadersWidth(): number;
	getHeaderLeftWidth(): number;
	getHeaderRightWidth(): number;

	getFooterNodes(): HTMLElement[];

	getContainer(): HTMLElement;

	hasFixedRows(): boolean;

	resizeGrid(): void;

	setGroupPanelText(text: string): void;

	getViewportDimensions(): { height: number; width: number; };

	groupingWasSet(state: boolean | undefined): boolean;

	toggleGroupIndicator(groupingInfos: object[], columnWidth: number): void;

	// used for drag/drop feedback
	highlightRows(rows: number[]): void;
	clearHighlightRows(): void;

	clearSelectedRows(): void;

	getCellNodeBoxForCopy(row: number, cell: number): ISlickCellBox;

	// internally used only
	hasFrozenColumns(ignoreIndicator: boolean | undefined): boolean;

	// internally used only (plugin)
	getContainerForCopy(): HTMLElement;

	//internally used only
	isInContainerView(): boolean;

	// Modifications: Events
	onTreeNodeExpanding: ISlickEvent;
	onTreeNodeCollapsing: ISlickEvent;
	onTreeNodeExpanded: ISlickEvent;
	onTreeNodeCollapsed: ISlickEvent;
	onHeaderToggled: ISlickEvent;
	onFilterChanged: ISlickEvent;
	onItemCountChanged: ISlickEvent;
	onSearchPanelVisibilityChanged: ISlickEvent;
	onCopyComplete: ISlickEvent;
	onPasteComplete: ISlickEvent;
	onBatchCopyComplete: ISlickEvent;
	onInitialized: ISlickEvent;

	// More bad mods:

	getRenderedRowIds(): any;

	// todo: only used internally in slick.rib-grid
	initEvents(): void;

	// todo: not used in code?
	updateSelection(): void;

	// todo: check if can be removed from public api - only used internally
	getDataItemValueForColumn(item: object, columnDef: ColumnDef<T>): any;

	// used in estimate.common
	toggleOverlay(show: boolean): void;

	sortColumn: ColumnDef<T> | null;
}
