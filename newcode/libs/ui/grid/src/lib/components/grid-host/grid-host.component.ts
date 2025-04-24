/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Injector, Input, OnDestroy, Renderer2, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import {
	CellChangeEvent,
	ColumnDef,
	FieldType,
	GridApiService,
	GridContainerType,
	GridRowInfo,
	IColumnGroupingProperties,
	IFieldValueChangeInfo,
	IGridApi,
	IGridConfiguration,
	isNumericFieldType,
	MouseEvent,
	TreeNodeEvent,
	TreeNodeEventType
} from '@libs/ui/common';
import { ContainerModuleInfoBase, IContainerDefinition } from '@libs/ui/container-system';
import { ISlickGridOptions } from '../../models/slick-grid/slick-grid-options.interface';
import { IUiGridEditorArg } from '../../models/grid-editor-arg.interface';
import { ISlickGrid } from '../../models/slick-grid/slick-grid.interface';
import {
	Dictionary, IDraggedDataInfo,
	isPropertyAccessor,
	isReadOnlyPropertyAccessor,
	ITranslated,
	PlatformConfigurationService,
	PlatformModuleManagerService,
	PlatformPermissionService,
	PlatformTranslateService,
	PropertyIdentifier,
	SortDirection,
} from '@libs/platform/common';
import { cloneDeep, get, isEqual, isNil } from 'lodash';
import { ISlickColumn } from '../../models/slick-grid/slick-column.interface';
import { createCustomElement } from '@angular/elements';
import { UiGridEditorHostComponent } from '../editor-host/editor-host.component';
import { ISlickDataView } from '../../models/slick-grid/slick-data-view.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISlickPlugin } from '../../models/slick-grid/slick-plugin.interface';
import { EditorControlContextService } from '../../services/editor-control-context.service';
import { UiGridEditorBase } from '../../models/grid-editor-base.class';
import { GridFormatterService } from '../../services/grid-formatter.service';
import { GridFilterService } from '../../services/grid-filter.service';
import { UiGridFilterHostComponent } from '../filter-host/filter-host.component';
import { IGridColumnFilter, IGridColumnFilterLogic } from '../../models/grid-column-filter.interface';

/* Event interfaces import */
import { ICellChangeEventArgs } from '../../models/event-args/cell-change-event-args.interface';
import { IClickEventArgs } from '../../models/event-args/click-event-args.interface';
import { IHeaderClickEventArgs } from '../../models/event-args/header-click-event-args.interface';
import { UiGridSearchHostComponent } from '../search-host/search-host.component';
import { IRowsChanged } from '../../models/event-args/rows-changed-event-args.interface';
import { ITreeLevelChanged} from '../../models/event-args/tree-level-changed-event-args.interface';
import { IDblClickEventArgs } from '../../models/event-args/dbl-click-event-args.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
declare let Slick: any;
declare let Ext: any;
/* eslint-enable  @typescript-eslint/no-explicit-any */

/**
 * Used to render grid
 */
@Component({
	standalone: true,
	selector: 'ui-grid-grid-host',
	templateUrl: './grid-host.component.html',
	styleUrls: ['./grid-host.component.scss'],
	encapsulation: ViewEncapsulation.None,
	//changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GridHostComponent<T extends object> implements IGridApi<T>, AfterViewInit, OnDestroy {
	private renderer = inject(Renderer2);
	private injector = inject(Injector);
	private permissionService = inject(PlatformPermissionService);
	private containers: IContainerDefinition[] = (inject(PlatformModuleManagerService).activeModule as ContainerModuleInfoBase).effectiveContainers || [];
	private gridFormatterService = new GridFormatterService<T>();
	private gridFilterService = new GridFilterService();
	private editorControlContext: EditorControlContextService<T> = inject(EditorControlContextService<T>); // as unknown as EditorControlContextService<T> ;
	private translateService = inject(PlatformTranslateService);
	private _entity?: T;
	private parentApi?: IGridApi<T>;
	private gridApiService = inject(GridApiService);
	private subscriptions: Subscription[] = [];
	private configurationService = inject(PlatformConfigurationService);
	private currentUILanguage = this.configurationService.savedOrDefaultUiLanguage;
	private _columnFilters: Map<string, IGridColumnFilter> = new Map<string, IGridColumnFilter>();

	public constructor(private vcr: ViewContainerRef) {
		this.subscriptions.push(this.configurationService.contextChangeEmitter.subscribe(() => {
			this.currentUILanguage = this.configurationService.savedOrDefaultUiLanguage;
		}));
	}

	/**
	 * Sets the entity object to edit in the grid.
	 * @param value The new entity object.
	 */
	public set entity(value: T | undefined) {
		this._entity = value;
	}

	/**
	 * Gets the entity object to edit in the grid.
	 */
	public get entity(): T | undefined {
		return this._entity;
	}

	/**
	 * Returns columns available to the grid
	 */
	public get columns(): ColumnDef<T>[] {
		return this.configuration.columns || [];
	}

	/**
	 * Sets columns available to the grid
	 */
	public set columns(columns: ColumnDef<T>[]) {
		this.config.columns = columns;
		this.grid?.setColumns(this.processColumnDefinition(this.config));
	}

	/**
	 * Hidden columns which are not shown in the grid
	 */
	public get hiddenColumns(): ColumnDef<T>[] {
		return this.configuration.columns?.filter(field => !field.visible) || [];
	}

	/**
	 * Columns which are visible in the grid
	 */
	public get visibleColumns(): ColumnDef<T>[] {
		return this.configuration.columns?.filter(field => field.visible || true) || [];
	}

	/**
	 * Method to scroll row containing item into view
	 * @param item object
	 * @param forceEdit boolean. If true, forces the row into edit mode
	 */
	public scrollRowIntoViewByItem(item: T, forceEdit: boolean) : void {
		if (!item || !this.grid) {
			return;
		}
		const grid = this.grid;
		const options = this.options;
		const dataView = this.dataView;

		const id = options.idProperty || 'Id';
		let row = dataView.getRowById(get(item, id));
		if (!row && options.treeConfiguration) {
			const items = dataView.getItems();
			let parent = this.findParent(get(options.treeConfiguration.parent(item), id), items);
			while (parent) {
				this.expand(parent);
				parent = this.findParent(get(options.treeConfiguration.parent(parent), id), items);
			}
			row = dataView.getRowById(get(item, id));
		}
		let cell = 0;
		for (let i = 0; i < this.visibleColumns.length; i++) {
			if (this.visibleColumns[i].keyboard && this.visibleColumns[i].keyboard?.enter) {
				cell = i;
				break;
			}
		}
		grid.gotoCell(row, cell, forceEdit);
	}

	/**
	 *
	 * @param parentId
	 * @param items
	 * @returns {*}
	 */
	private findParent(parentId: number | null, items : object[]) : T | undefined {
		if (parentId) {
			const options = this.options;

			const id = options.idProperty || 'Id';

			let parent;
			for (let i = 0; i < items.length; i++) {
				if (get(items[i], id) === parentId) {
					parent = items[i];
				} else if (options.treeConfiguration?.children(items[i] as T)) {
					parent = this.findParent(parentId, options.treeConfiguration?.children(items[i] as T));
				}
				if (parent) {
					break;
				}
			}
			return parent as T;
		}
		return undefined;
	}

	/**
	 * Method to update column/columns in the grid
	 * @param columns object or array of objects of IField types
	 */
	public updateColumns(columns: ColumnDef<T> | ColumnDef<T>[]): void {
		let updateGridConfig = false;
		const currentColumns = this.configuration.columns || [];

		(columns instanceof Array ? columns : [columns]).forEach((column) => {
			const index = currentColumns.findIndex(field => field.id === column.id);

			if (index === -1) {
				throw new Error(`Column ${column.id} not found! Must be available in configuration!`);
			}

			if (!isEqual(currentColumns[index], column)) {
				currentColumns[index] = cloneDeep(column);
				updateGridConfig = true;
			}
		});

		if (updateGridConfig) {
			// TODO processColumns and apply saved configuration
		}
	}

	/**
	 * Returns current selection
	 */
	public get selection(): T[] {
		const grid = this.grid;
		const selectionArr: T[] = [];
		grid?.getSelectedRows().forEach(function (index) {
			const dataItem = grid?.getDataItem(index);
			if(dataItem) {
				selectionArr.push(grid?.getDataItem(index));
			}
		});
		return selectionArr;
	}

	/**
	 * Updates selection
	 */
	public set selection(items: [T]) {
		if (this.grid) {
			const grid = this.grid;
			const options = this.options;
			const dataView = this.dataView;
			const id = options.idProperty || 'Id';
			const rows = dataView?.getRows();

			if (rows) {
				const selection: number[] = [];

				items.forEach((item) => {
					const index = rows.findIndex((row) => {
						return get(row, id) === get(item, id);
					});
					if (index !== -1) {
						selection.push(index);
					}
				});

				grid.setSelectedRows(selection, true);

				if (selection.length) {
					grid.scrollRowIntoView(selection[0]);
				}
			}
		}
	}

	/**
	 * Returns current items in grid
	 */
	public get items(): T[] {
		return this.dataView?.getItems() as T[];
	}

	/**
	 * Updates items in grid
	 */
	@Input()
	public set items(items: T[]) {
		this.config.items = items;
		this.dataView?.setItems(items);
		const gridRowInfos = new Dictionary<T, GridRowInfo<T>>();
		this.editorControlContext.register(this.uuid, gridRowInfos);
		this.grid?.invalidate();

		this.itemsChanged.emit(items);
	}

	/**
	 * Method to show/hide the column search row in the grid
	 */
	public columnSearch() {
		this.options.showColumnSearchPanel = !this.options.showColumnSearchPanel;
		this.grid?.setHeaderRowVisibility(this.options.showColumnSearchPanel);
		if (this.options.showSearchPanel) {
			this.options.showSearchPanel = false;
			this.grid?.mainTopPanelVisibility(this.options.showSearchPanel, this.options.searchValue);
		}
	}

	/**
	 * Method to show/hide the standard search panel in the grid
	 */
	public searchPanel() {
		this.options.showSearchPanel = !this.options.showSearchPanel;
		this.grid?.mainTopPanelVisibility(this.options.showSearchPanel, this.options.searchValue);
		if (this.options.showColumnSearchPanel) {
			this.options.showColumnSearchPanel = false;
			this.grid?.setHeaderRowVisibility(this.options.showColumnSearchPanel);
		}
	}

	/**
	 * Method to show/hide the group panel in the grid
	 */
	public groupPanel() {
		this.grid?.groupPanelVisibility(!this.grid?.getOptions().showGroupingPanel);
	}

	/**
	 * Tree method to expand the node provided
	 * @param node
	 */
	public expand(node: T) {
		this.grid?.getData().expandNode(node);
		this.grid?.invalidate();
	}

	/**
	 * Tree method to collapse the node provided
	 * @param node
	 */
	public collapse(node: T) {
		this.grid?.getData().collapseNode(node);
		this.grid?.invalidate();
	}

	/**
	 * Tree method to expand all nodes in grid
	 */
	public expandAll(level?: number) {
		this.grid?.getData().expandAllNodes(level);
		this.grid?.invalidate();
	}

	/**
	 * Tree method to collapse all nodes in grid
	 */
	public collapseAll() {
		this.grid?.getData().collapseAllNodes();
		this.grid?.invalidate();
	}

	/**
	 * Method to resize grid
	 */
	public resizeGrid() {
		this.grid?.resizeGrid();
	}

	/**
	 * Invalidates single/multiple data items or the complete grid
	 * Updates the UI for given items (grid rows) or whole grid
	 * @param items optional list of items to be invalidated otherwise invalidate whole grid
	 */
	public invalidate(items?: T[] | T): void {
		if(isNil(items)) {
			this.grid?.invalidate();
		} else {
			if(!(items instanceof Array)) {
				items = new Array<T>(items);
			}

			const id = this.options.idProperty?.toString() || 'Id';
			const rows = items.map(item => this.dataView?.getRowById(get(item as unknown,id)));

			this.grid?.invalidateRows(rows);
			this.grid?.render();
		}
	}

	/**
	 * Executes an internal refresh and optionally invalidates the grid
	 * @param invalidate optional, if true an invalidate is executed as well
	 */
	public refresh(invalidate?: boolean): void {
		this.dataView?.refresh();

		if(invalidate) {
			this.grid?.invalidate();
		}
	}

	/**
	 * Highlight rows
	 */
	public highlightRows(row: number[]) {
		this.grid?.highlightRows(row);
	}

	/**
	 * Clear highlight row
	 */
	public clearHighlightRow() {
		this.grid?.clearHighlightRows();
	}

	public getMaxTreeLevel(): number {
		return this.dataView?.getMaxTreeLevel();
	}

	private visibleGridColumns: ColumnDef<T>[] = [];

	/**
	 * slick grid container reference
	 * @private
	 */
	@ViewChild('grid', {read: ViewContainerRef})
	private gridContainer!: ViewContainerRef;
	private dataView!: ISlickDataView<T>;
	private grid: ISlickGrid<T> | null = null;
	private plugins: Record<string, ISlickPlugin<T>> = {};
	private static customElementsInitialized = false;

	/**
	 * registers GridComponent and EditorHostComponent as custom elements
	 */
	public static createCustomElements(injector: Injector) {
		if (!GridHostComponent.customElementsInitialized) {
			// Create and register custom element with the browser.
			const customGridHostElement = createCustomElement(GridHostComponent, {injector: injector});
			const customEditorHostElement = createCustomElement(UiGridEditorHostComponent, {injector: injector});
			const customFilterHostElement = createCustomElement(UiGridFilterHostComponent, {injector: injector});

			customElements.define('custom-ui-grid-host', customGridHostElement);
			customElements.define('custom-ui-grid-editor-host', customEditorHostElement);
			customElements.define('custom-ui-grid-filter-host', customFilterHostElement);
		}
	}

	public hostInitialized(gridHostApi: IGridApi<T>) {
		throw Error('Must not be called from application code!');
	}

	/**
	 * grid's uuid
	 */
	@Input()
	public set uuid(value: string) {
		this.config.uuid = value;
	}

	public get uuid(): string {
		return this.config.uuid || '00000000000000000000000000000000';
	}

	/**
	 * grid selection changed
	 */
	public get selectionChanged(): EventEmitter<T[]> {
		if (this.parentApi) {
			return this.parentApi.selectionChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).selectionChanged;
		}
	}

	/**
	 * items changed
	 */
	public get itemsChanged(): EventEmitter<T[]> {
		if (this.parentApi) {
			return this.parentApi.itemsChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).itemsChanged;
		}
	}

	/**
	 * grid initialized subscription
	 */
	public get initialized(): BehaviorSubject<boolean> {
		if (this.parentApi) {
			return this.parentApi.initialized;
		} else {
			return this.gridApiService.get<T>(this.uuid).initialized;
		}
	}

	/**
	 * Event triggered when subscribed or configuration changed
	 * Provides latest grid configuration
	 */
	public get configurationChanged(): BehaviorSubject<IGridConfiguration<T>> {
		if (this.parentApi) {
			return this.parentApi.configurationChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).configurationChanged;
		}
	}

	/**
	 * Event triggered when a tree node is collapsing or expanding
	 */
	public get treeLevelChanged(): EventEmitter<number> {
		if (this.parentApi) {
			return this.parentApi.treeLevelChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).treeLevelChanged;
		}
	}

	/**
	 * Event triggered when a tree node is collapsing or expanding
	 */
	public get treeNodeChanging(): EventEmitter<TreeNodeEvent<T>> {
		if (this.parentApi) {
			return this.parentApi.treeNodeChanging;
		} else {
			return this.gridApiService.get<T>(this.uuid).treeNodeChanging;
		}
	}

	/**
	 * Event triggered when a tree node has been collapsed or expanded
	 */
	public get treeNodeChanged(): EventEmitter<TreeNodeEvent<T>> {
		if (this.parentApi) {
			return this.parentApi.treeNodeChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).treeNodeChanged;
		}
	}

	/**
	 * Event triggered when a property of an entity has been changed
	 */
	public get valueChanged(): EventEmitter<IFieldValueChangeInfo<T>> {
		if (this.parentApi) {
			return this.parentApi.valueChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).valueChanged;
		}
	}

	/**
	 * Event triggered when a mouse click in grid occurs
	 */
	public get mouseClick(): EventEmitter<MouseEvent<T>> {
		if (this.parentApi) {
			return this.parentApi.mouseClick;
		} else {
			return this.gridApiService.get<T>(this.uuid).mouseClick;
		}
	}

	/**
	 * Event triggered when a mouse enters a grid cell
	 */
	public get mouseEnter(): EventEmitter<MouseEvent<T>> {
		if(this.parentApi) {
			return this.parentApi.mouseEnter;
		} else {
			return this.gridApiService.get<T>(this.uuid).mouseEnter;
		}
	}

	/**
	 * Event triggered when a mouse leaves a grid cell
	 */
	public get mouseLeave(): EventEmitter<MouseEvent<T>> {
		if(this.parentApi) {
			return this.parentApi.mouseLeave;
		} else {
			return this.gridApiService.get<T>(this.uuid).mouseLeave;
		}
	}

	/**
	 * Event trigger when mouse double clicks in grid
	 */
	public get doubleClick(): EventEmitter<MouseEvent<T>> {
		if(this.parentApi) {
			return this.parentApi.doubleClick;
		} else {
			return this.gridApiService.get<T>(this.uuid).doubleClick;
		}
	}

	/**
	 * Event triggered when cell changes
	 */
	public get cellChanged(): EventEmitter<CellChangeEvent<T>> {
		if (this.parentApi) {
			return this.parentApi.cellChanged;
		} else {
			return this.gridApiService.get<T>(this.uuid).cellChanged;
		}
	}

	/**
	 * Event triggered when a mouse drag starts in grid occurs
	 */
	public get dragStart(): EventEmitter<IDraggedDataInfo<T>> {
		if(this.parentApi) {
			return this.parentApi.dragStart;
		} else {
			return this.gridApiService.get<T>(this.uuid).dragStart;
		}
	}

	/**
	 * Event triggered when a mouse drag ends in grid occurs
	 */
	public get dragEnd(): EventEmitter<IDraggedDataInfo<T>> {
		if(this.parentApi) {
			return this.parentApi.dragEnd;
		} else {
			return this.gridApiService.get<T>(this.uuid).dragEnd;
		}
	}

	/**
	 * Default grid configuration
	 * @private
	 */
	private config: IGridConfiguration<T> = {
		uuid: '00000000000000000000000000000000',
		indicator: true,
		//idProperty: 'Id',
		iconClass: null,
		items: [],
		columns: [],
		containerType: GridContainerType.Undefined,
		saveSearchValue: true,
		saveConfiguration: true,
		globalEditorLock: true,
		enableColumnSort: true,
		enableColumnReorder: true,
	};

	@Input()
	public set configuration(config: IGridConfiguration<T>) {
		const oldConfig = this.config;

		this.config = {...oldConfig, ...config};

		if (oldConfig.columns !== this.config.columns) {
			this.columns = this.config.columns || [];
		}

		if (oldConfig.items !== this.config.items) {
			this.items = this.config.items || [];
		}

		this.gridFormatterService.entityRuntimeData = this.config.entityRuntimeData;
	}

	public get configuration(): IGridConfiguration<T> {
		return this.config;
	}

	/**
	 *
	 */
	@Input()
	public options: IGridConfiguration<T> & ISlickGridOptions<T> = {
	};

	/**
	 * After view init lifecycle hook
	 */
	public ngAfterViewInit(): void {
		this.parentApi = this.gridApiService.get(this.uuid);
		this.subscriptions.push(this.parentApi.configurationChanged.subscribe((value) => {
			this.configuration = value;
			if (value.uuid && value.uuid.length === 32 && value.uuid !== '00000000000000000000000000000000' && !this.grid) {
				this.createGrid();
			}
		}));
		this.parentApi.hostInitialized(this as IGridApi<T>);
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy(): void {
		this.initialized.next(false);
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
		this.subscriptions.length = 0;
	}

	private editor(grid: GridHostComponent<T>) {
		return function (args: IUiGridEditorArg<T>) {
			args.gridId = grid.uuid;
			if (grid.parentApi) {
				args.grid = grid.parentApi;
			}
			return new UiGridEditorBase(args, grid.editorControlContext);
		};
	}

	/**
	 * formatter used for tree structure column
	 */
	private treeFormatter(row: unknown, cell: unknown, value: unknown, columnDef: ISlickColumn, entity: T, plainText = false) {
		let text = '';

		if (columnDef.configuration?.treeConfiguration?.description) {
			columnDef.configuration.treeConfiguration.description.forEach(entry => {
				text = text + ' ' + get(entity, entry + '.DescriptionInfo', get(entity, entry, ''));
			});
		}

		if (plainText) {
			return text;
		} else {
			const level = get(entity, 'nodeInfo.level', 0) as number;
			const container = $('<div>');
			const toggle = $('<span>').css({
				'display': 'inline-block',
				'vertical-align': 'middle',
				'margin-left': (10 * level) + 'px'
			}).addClass('control-icons tree-toggle block-image');

			container.append(toggle);

			if (get(entity, 'HasChildren') || get(entity, 'nodeInfo.children')) {
				toggle.addClass('toggle');
				if (get(entity, 'nodeInfo.collapsed')) {
					toggle.removeClass('ico-tree-expand');
					toggle.addClass('ico-tree-collapse');
				} else {
					toggle.addClass('ico-tree-expand');
					toggle.removeClass('ico-tree-collapse');
				}
			}

			let image = get(entity, 'image', 'ico-folder-empty') as string;

			if (image.substring(0, 4) === 'ico-') {
				image = 'control-icons ' + image;
			}

			const iconBox = $('<i>').addClass('block-image ' + image);
			const description = $('<span>');

			container.append(iconBox);
			description.text(text);
			description.css('margin-left', '5px');
			container.append(description);

			return container[0].innerHTML;
		}
	}

	private processColumnDefinition(config: IGridConfiguration<T>): ISlickColumn[] {
		const result: ISlickColumn[] = [];
		const readonly = this.isReadonly();

		if (get(config, 'indicator', true)) {
			result.push({
				id: 'indicator',
				name: '',
				field: 'indicator',
				width: 20,
				minWidth: 20,
				resizable: false,
				sortable: false,
				behavior: 'selectAndMove',
				formatter: (row: unknown, cell: unknown, value: string) => value || '',
				cssClass: 'indicator dnd',
				pinned: true,
				printable: false,
				hidden: false,
				keyboard: {
					enter: false,
					tab: false
				},
				readonly: false,
				required: false,
				searchable: false,
				toolTip: '',
			});
			config.indicator = true;
		}

		if (config.marker) {
			// TODO: implement this case
		}

		if (config.treeConfiguration) {
			this.translateService.translateObject(config.treeConfiguration, ['header']);

			result.push({
				id: 'tree',
				name: (config.treeConfiguration?.header as ITranslated)?.text || 'Structure',
				toolTip: (config.treeConfiguration?.header as ITranslated)?.text || 'Structure',
				field: 'tree',
				width: config.treeConfiguration?.width || 150,
				minWidth: 40,
				sortable: false,
				formatter: this.treeFormatter,
				pinned: true,
				cssClass: '',
				hidden: false,
				keyboard: {
					enter: false,
					tab: false
				},
				readonly: false,
				required: true,
				searchable: false,
				printable: config.treeConfiguration?.printable || true,
				configuration: config as unknown as IGridConfiguration<object>,
			});
		}

		if ('columns' in config && config.columns instanceof Array) {
			this.translateService.translateObject(config.columns, ['label', 'tooltip'], true);

			config.columns.forEach((column: ColumnDef<T>) => {
				const columnReadonly = readonly || column.readonly || (isPropertyAccessor(column.model) ? false : isReadOnlyPropertyAccessor(column.model));
				const groupingDefault: IColumnGroupingProperties = {
					title: (column.label as ITranslated).text,
					getter: column.model ? column.model.toString() : '',
					aggregators: [],
					aggregateCollapsed: false,
					generic: false
				};

				if (!column.tooltip) {
					column.tooltip = column.label;
				}

				result.push({
					id: column.id,
					name: (column.label as ITranslated).text,
					toolTip: (column.tooltip as ITranslated).text,
					field: column.model as PropertyIdentifier<object>,
					cssClass: column.cssClass || '',
					grouping: column.grouping ? column.grouping : groupingDefault,
					keyboard: column.keyboard || {
						enter: true,
						tab: true
					},
					type: column.type,
					required: column.required || false,
					sortable: column.sortable || true,
					searchable: column.searchable || true,
					readonly: columnReadonly,
					pinned: column.pinned || false,
					hidden: column.visible ? !column.visible : false,
					width: column.width || 100,
					editor: !columnReadonly ? this.editor(this) : null,
					editorOptions: {},
					//editorOptions: column.editorOptions || {},
					/* eslint-disable  @typescript-eslint/no-explicit-any */
					formatter: this.gridFormatterService.getFormatter(column.type, this.uuid), // TODO: lookup formatter
					/* eslint-enable  @typescript-eslint/no-explicit-any */
					formatterOptions: column.formatterOptions,
					headerChkbox: column.headerChkbox ? true : false
				});
			});
		}
		return result;
	}

	/**
	 * default slick grid options (https://github.com/mleibman/SlickGrid/wiki/Grid-Options)
	 */
	private defaultOptions: IGridConfiguration<T> | ISlickGridOptions<T> = {
		enableCellNavigation: true,
		enableDraggableGroupBy: true,
		multiColumnSort: false,
		enableAsyncPostRender: true,
		editable: true,
		rowReordering: false,
		enableColumnReorder: true,
		autoEdit: false,
		showColumnSearchPanel: false,
		showSearchPanel: false,
		indicator: true,
		enableCopyPasteExcel: true
	};

	private createGrid(): void {
		const nativeElement = this.gridContainer.element.nativeElement;

		if (!nativeElement) {
			throw new Error('Can\'t create grid due to native element not available!');
		}

		this.options = {
			...this.defaultOptions,
			...this.options,
			...this.config,
			api: this,
		};

		// if grid is not in a subview-content, then disable copy/paste
		this.options.enableCopyPasteExcel = this.config.containerType !== GridContainerType.Container ? false : !!this.config.enableCopyPasteExcel;
		this.options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider() as ISlickPlugin<T>;
		this.dataView = new Slick.Data.DataView(this.options);
		this.dataView?.setItems(this.config.items || []);
		const grid = this.grid = new Slick.Grid(this.gridContainer.element.nativeElement, this.dataView, this.processColumnDefinition(this.config), this.options) as ISlickGrid<T>;

		if (!this.grid) {
			throw 'Grid not created!';
		}

		this.dataView?.setGrid(grid);
		this.renderer.addClass(nativeElement, this.uuid);
		this.renderer.setAttribute(nativeElement, 'id', this.uuid);

		// todo: register grid in uiGridService
		// platformGridAPI.grids.register(grid);
		if (this.config.iconClass) {
			this.renderer.addClass(nativeElement, this.config.iconClass);
		}

		// todo: resize grid ...
		// platformGridAPI.grids.resize(scope.data.state);

		if (this.options.enableDraggableGroupBy && !this.options.treeConfiguration) {
			const key = 'platform.gridDropPanel';
			this.options.groupPanelText = get(this.translateService.instant(key), key);
			// todo: set grouping
			// setupGrouping(obj.columns.visible);
		}

		this.options.saveConfiguration = this.options.saveConfiguration ?? this.config.containerType === GridContainerType.Container;

		if (this.options.isStaticGrid) {
			this.initializeGrid().then(() => this.initialized.next(true));
		} else {
			/*
			  loadConfiguration(obj, options)
				 .then(applyConfiguration)
				 .then(initializeGrid)
				 .then(setInitialGrouping)
				 .then(function () {
					let timerSet = $timeout(function () {
					  if(_viewChange && !obj.options.isUserContainer) {
						 onColumnStateChanged(obj.id);
						 _viewChange = false;
					  }
					  timerSet = null;
					}, 1000);

					trigger(this.grid, this.grid?.onInitialized);
				 });
			  */
		}

		//this.grid?.invalidate();
		grid.resizeCanvas();

		grid.setSelectionModel(new Slick.RowSelectionModel());

		this.dataView?.onRowsChanged.subscribe((e, args: IRowsChanged<T>) => {
			grid.invalidateRows(args.rows);
			grid.render();
		});

		this.dataView?.onTreeLevelChanged.subscribe((e, args: ITreeLevelChanged<T>) => {
			this.treeLevelChanged.emit(args.maxLevel);
		});

		grid.onMouseEnter.subscribe((e, args) => {
			const cell = grid.getCellFromEvent(e);
			if (cell) {
				const item = grid.getDataItem(cell.row);
				const evt = new MouseEvent<T>(e, cell.row, cell.cell, item);
				this.mouseEnter.emit(evt);
			}
		});

		grid.onMouseLeave.subscribe((e, args) => {
			const cell = grid.getCellFromEvent(e);
			if (cell) {
				const item = grid.getDataItem(cell.row);
				const evt = new MouseEvent<T>(e, cell.row, cell.cell, item);
				this.mouseLeave.emit(evt);
			}
		});

		grid.onCellChange.subscribe((e, args: ICellChangeEventArgs<T>) => {
			const evt = new CellChangeEvent<T>(args.row, args.cell, args.column, args.item);
			this.cellChanged.emit(evt);
		});

		grid.onSelectedRowsChanged.subscribe((e, args) => {
			const selectedRows: T[] = [];
			for (let i = 0; i < args.rows.length; i++) {
				const row = args.rows[i];
				const data = grid.getDataItem(row);
				selectedRows.push(data);
				if (i === args.rows.length - 1) {
					this.entity = data;
				}
			}
			this.selectionChanged.emit(selectedRows);
		});

		grid.onHeaderRowCellRendered.subscribe((e, args) => {
			if (args.column.id !== 'indicator' && args.column.id !== 'tree' && args.column.id !== 'marker' && args.column.id !== 'group') {
				const node = $(args.node)[0];
				if(node.childElementCount === 0) {
					const ref = this.vcr.createComponent(UiGridFilterHostComponent);
					ref.setInput('fieldtype', args.column.type);
					ref.setInput('value', this._columnFilters.get(args.column.id));

					ref.instance.filterEvent.subscribe((value: string)=> {
						if(args.column.field) {
							let columnFilter: IGridColumnFilter | undefined = this._columnFilters.get(args.column.id);
							const filterLogic: IGridColumnFilterLogic[] = this.gridFilterService.parseQuery(value.toString(), args.column.field.toString());
							if (!columnFilter) {
								columnFilter = {colId: args.column.id, filterString: value, filters: filterLogic};
								this._columnFilters.set(args.column.id, columnFilter);
							} else {
								columnFilter.filterString = value;
								columnFilter.filters = filterLogic;
							}
							grid.getData().setFilterArgs({columnFilters: Array.from(this._columnFilters.values())});
							grid.getData().refresh();
							grid.invalidate();
						}
					});
					node.appendChild(ref.location.nativeElement);
				}
			}
		});

		const filterColumn = (item: T, args: {columnFilters: IGridColumnFilter[], customFilter: (item: T) => boolean, promises: []}, lookupCache: []): boolean  => {
			let result: boolean = false;
			if (this._columnFilters) {// For column filter
				const columnFilters: IGridColumnFilter[] = Array.from(this._columnFilters.values());

				for (let i = 0; i < columnFilters.length; i++) {
					const columnFilterModel: IGridColumnFilter = columnFilters[i];

					if (columnFilterModel.filterString !== '') {
						const col: ColumnDef<T> | undefined = this.visibleColumns.find((c) => c.id === columnFilterModel.colId);
						if (col) {
							const formatter = this.gridFormatterService.getFormatter(col.type, this.uuid);
							const slickColumn = this.grid?.getColumns().find(slickCol => slickCol.id === col.id);

							if (slickColumn) {
								let value = isReadOnlyPropertyAccessor(slickColumn.field) ? slickColumn.field.getValue(item) : get(item, slickColumn.field as string);
								if(col.type === FieldType.Boolean && columnFilterModel.filterString) {
									result = this.gridFilterService.filterBoolean(value, columnFilterModel.filterString);
								} else {
									if (formatter) {
										value = formatter(0, 0, value, slickColumn, item, true, -1);
										if (columnFilterModel.filters) {
											result = this.gridFilterService.filter(value, columnFilterModel.filters, col.type);
										} else {
											if (columnFilterModel.filterString) {
												columnFilterModel.filters = this.gridFilterService.parseQuery(columnFilterModel.filterString.toString(), slickColumn.field as string);
												result = this.gridFilterService.filter(value, columnFilterModel.filters, col.type);
											}
										}
									}
								}
							}
							if (!result) {
								break;
							}
						}
					} else {
						result = true;
					}
				}
				//Todo: Implement custom filter
				/*if (args.customFilter && result) {
					result = args.customFilter(item);
				}*/
				if (this.config.treeConfiguration && !result) {
					const children = this.config.treeConfiguration.children(item);
					if (children && children.length > 0) {
						result = filterTreeColumn(children, args, lookupCache);
					}
				}
			}
			return result;
		};

		const filterTreeColumn = (childItems: T[], args: {columnFilters: IGridColumnFilter[], customFilter: (item: T) => boolean, promises: []}, lookupCache: []): boolean  => {
			let result: boolean = false;
			for (let i = 0; i < childItems.length; i++) {
				const item = childItems[i];
				result = filterColumn(item, args, lookupCache);
				if (this.config.treeConfiguration && !result) {
					const children = this.config.treeConfiguration.children(item);
					if (children && children.length > 0) {
						result = filterTreeColumn(children, args, lookupCache);
					}
				}
				if (result) {
					break;
				}
			}
			return result;
		};

		const filter = (item: T, args: {searchString: string, columnFilters: IGridColumnFilter[], customFilter: (item: T) => boolean, promises: []}, lookupCache: []): boolean  => {
			let value, result = false;

			if ((!args.columnFilters || args.columnFilters.length === 0) && !args.searchString) {
				if (args.customFilter) {
					return args.customFilter(item);
				}
				return true;
			} else {
				let filterRegex;

				if (args.searchString) {
					filterRegex = new RegExp(args.searchString, 'i');
				}

				for (let a = 0; a < this.visibleColumns.length; a++) {
					const col: ColumnDef<T> = this.visibleColumns[a];
					if (col.searchable !== undefined && !col.searchable) {
						continue;
					}

					if (col) {
						const formatter = this.gridFormatterService.getFormatter(col.type, this.uuid);
						const slickColumn = this.grid?.getColumns().find(slickCol => slickCol.id === col.id);

						if (slickColumn) {
							value = isReadOnlyPropertyAccessor(slickColumn.field) ? slickColumn.field.getValue(item) : get(item, slickColumn.field as string);
							if (formatter) {
								value = formatter(0, 0, value, slickColumn, item, true, -1);
							}
							if (filterRegex && filterRegex.test(value)) {
								result = true;
								break;
							}
						}
					}
				}
				if (args.customFilter && result) {
					result = args.customFilter(item);
				}
			}
			return result;
		};

		this.dataView.setColumnFilter(filterColumn);
		this.dataView.setFilter(filter);

		this.initializeGrid().then(() => this.initialized.next(true));
	}

	private registerPlugin(name: string, plugin: ISlickPlugin<T>): void {
		this.plugins[name] = plugin;
		this.grid?.registerPlugin(plugin);
	}

	private onBeforeMoveRow(event: Event, args: { rows: number[]; insertBefore: number; }): boolean {
		for (let i = 0; i < args.rows.length; i++) {
			// no point in moving before or after itself
			if (args.rows[i] === args.insertBefore || args.rows[i] === args.insertBefore - 1) {
				event.stopPropagation();

				return false;
			}
		}
		return true;
	}

	private onMoveRows(event: Event, args: { rows: number[]; insertBefore: number; }): void {
		if (this.grid && this.dataView) {
			let data = this.dataView.getItems() || [];
			const extractedRows = [];
			const rows = args.rows;
			const insertBefore = args.insertBefore;
			const selectedRows = [];
			const left = data.slice(0, insertBefore);
			const right = data.slice(insertBefore, data.length);

			rows.sort(function (a, b) {
				return a - b;
			});
			for (let i = 0; i < rows.length; i++) {
				extractedRows.push(data[rows[i]]);
			}
			rows.reverse();
			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				if (row < insertBefore) {
					left.splice(row, 1);
				} else {
					right.splice(row - insertBefore, 1);
				}
			}
			data = left.concat(extractedRows.concat(right));
			for (let i = 0; i < rows.length; i++) {
				selectedRows.push(left.length + i);
			}
			this.grid.resetActiveCell();
			this.grid.setData(data);
			this.grid.setSelectedRows(selectedRows);
			this.grid.render();
		}
	}

	private entityComparer = (i1: T, i2: T): number => {
		if (this.grid) {
			let x, y;
			let result = 0;
			//const domain = 'string'; // default

			if (this.grid.sortColumn) {
				const sortColumn = this.grid.sortColumn as ISlickColumn;

				const isNumber = sortColumn.type ? isNumericFieldType(sortColumn.type) : false;

				if(sortColumn.field) {
					if (sortColumn.formatter && !isNumber) {
						x = sortColumn.formatter(0, 0, get(i1, sortColumn.field.toString()), sortColumn, i1, true);
						y = sortColumn.formatter(0, 0, get(i2, sortColumn.field.toString()), sortColumn, i2, true);
					} else {
						x = get(i1, sortColumn.field.toString());
						y = get(i2, sortColumn.field.toString());
					}
				}

				if (isNumber) {
					result = Math.sign((x as number) - (y as number));
				} else if (!x || x === '') {
					result = 1;
				} else if (!y || y === '') {
					result = -1;
				} else {
					if (typeof x === 'string' && typeof y === 'string') {
						if(sortColumn.sortOptions && sortColumn.sortOptions.numeric) {
							result = x.toLowerCase().localeCompare(y.toLowerCase(), this.currentUILanguage, {numeric: true});
						} else {
							result = x.toLowerCase().localeCompare(y.toLowerCase(), this.currentUILanguage);
						}
					} else {
						result = (x === y ? 0 : (x > y ? 1 : -1));
					}
				}
			}

			return result;
		}

		return 1;
	};

	private onHeaderFilterCommand = (event: Event, args: { column: ColumnDef<T>, command: string, grid: ISlickGrid<T> }): void => {
		if (this.grid && this.dataView) {
			if (args.command && args.column) {
				const sortColumn = this.grid.sortColumn = args.column;

				this.grid.sortColumn.sort = args.command === 'sort-asc' ? SortDirection.Ascending : SortDirection.Descending;

				switch (args.command) {
					case 'sort-asc':
						if (this.options.treeConfiguration) {
							this.dataView.sortTree(this.entityComparer, true);
						} else {
							this.dataView.sort(this.entityComparer, {ascending: sortColumn.sort === SortDirection.None ? undefined : sortColumn.sort === SortDirection.Ascending});
						}
						break;

					case 'sort-desc':
						if (this.options.treeConfiguration) {
							this.dataView.sortTree(this.entityComparer, false);
						} else {
							this.dataView.sort(this.entityComparer, {ascending: sortColumn.sort === SortDirection.None ? undefined : sortColumn.sort === SortDirection.Ascending});
						}
						break;
				}
			} else {
				if (this.options.defaultSortColumn) {
					this.grid.sortColumn = this.visibleGridColumns.find(x => x.id === this.options.defaultSortColumn) || null;
					if (this.grid.sortColumn) {
						this.grid.sortColumn.sort = SortDirection.Ascending;
						if (this.options.treeConfiguration) {
							this.dataView.sortTree(this.entityComparer, true);
						} else {
							this.dataView.sort(this.entityComparer, {ascending: this.grid.sortColumn.sort === SortDirection.Ascending ? true : (this.grid.sortColumn.sort === SortDirection.Descending ? false : undefined)});
						}
					}
				} else if (this.options.defaultSortComparer) {
					this.grid.sortColumn = null;
					if (this.options.treeConfiguration) {
						this.dataView.sortTree(this.options.defaultSortComparer, true);
					} else {
						this.dataView.sort(this.options.defaultSortComparer, this.grid.sortColumn || {ascending: true});
					}
				} else {
					this.grid.sortColumn = null;
				}
			}
			this.dataView.syncGridSelection(this.grid, true);
			this.grid.updateSelection();
			this.grid.invalidate();

			// TODO
			// onColumnStateChanged(this.id);
		}
	};

	private initializeGrid(): Promise<boolean> {
		return new Promise<boolean>(resolve => {
			if (!this.grid) {
				throw new Error('Grid instance not created!');
			}

			if (this.options.showFooter) {
				new Slick.Controls.ExtFooter(this.dataView, this.grid, {
					scrollable: true,
					type: 'column',
					template: null
				});
				this.grid.resizeCanvas();
			}

			/* Initialize Search Panel */
			const searchPanel = $(this.grid.getMainTopPanel()).find('.slick-search-panel');
			const ref = this.vcr.createComponent(UiGridSearchHostComponent);

			ref.instance.filterEvent.subscribe((value: string | null )=> {
				if(this.grid) {
					this.grid.getData().setFilterArgs({searchString: value});
					this.grid.getData().refresh();
					this.grid.invalidate();
				}
			});
			$(searchPanel[0]).append(ref.location.nativeElement);

			this.grid.mainTopPanelVisibility(this.options.showSearchPanel, this.options.searchValue);

			/* Initialize Column Filter Row */
			const headerRowScroller = this.grid.getHeaderRowScroller();
			for (let a = 0; a < this.visibleColumns.length; a++) {
				const col: ColumnDef<T> = this.visibleColumns[a];

				const headerRowCell = $(headerRowScroller).find('[class~="ui-item-field-' + col.id + '"]');
				if(headerRowCell) {
					if($(headerRowCell).children().length === 0) {
						const ref = this.vcr.createComponent(UiGridFilterHostComponent);
						ref.setInput('fieldtype', col.type);
						ref.setInput('value', this._columnFilters.get(col.id));

						ref.instance.filterEvent.subscribe((value: string)=> {
							let columnFilter: IGridColumnFilter | undefined = this._columnFilters.get(col.id);
							const filterLogic: IGridColumnFilterLogic[] = this.gridFilterService.parseQuery(value.toString(), col.id);
							if (!columnFilter) {
								columnFilter = {colId: col.id, filterString: value, filters: filterLogic};
								this._columnFilters.set(col.id, columnFilter);
							} else {
								columnFilter.filterString = value;
								columnFilter.filters = filterLogic;
							}
							this.grid?.getData().setFilterArgs({columnFilters: Array.from(this._columnFilters.values())});
							this.grid?.getData().refresh();
							this.grid?.invalidate();
						});
						$(headerRowCell).append(ref.location.nativeElement);
					}
				}
			}

			this.grid.setSelectionModel(new Slick.RowSelectionModel());

			if(this.options.markReadonlyCells) {
				$(this.grid.getContainer()).addClass('show-readonly');
			}

			/* Start Slickgrid Plugins */
			this.registerPlugin('GroupItemMetadataProvider', new Slick.Data.GroupItemMetadataProvider());
			this.registerPlugin('AutoColumnSize', new Slick.AutoColumnSize());

			if (this.options.allowRowDrag) {
				const moveRowsPlugin = new Slick.RowMoveManager({
					cancelEditOnDrag: true
				});

				moveRowsPlugin.onBeforeMoveRows.subscribe((event: Event, args: { rows: number[]; insertBefore: number; }) => this.onBeforeMoveRow(event, args));
				moveRowsPlugin.onMoveRows.subscribe((event: Event, args: { rows: number[]; insertBefore: number; }) => this.onMoveRows(event, args));

				this.registerPlugin( 'RowMoveManager', moveRowsPlugin);
			}

			this.registerPlugin('CheckboxColumn',new Slick.CheckboxColumn({
				injector: this.injector,
				runtimeDataService: this.configuration.entityRuntimeData,
				editorControlContextService: this.editorControlContext
			}));

			const filterPlugin = new Ext.Plugins.HeaderFilter({}); // jshint ignore:line

			if (filterPlugin) {
				filterPlugin.onCommand.subscribe(this.onHeaderFilterCommand);
				this.registerPlugin( 'HeaderFilter', filterPlugin);
			}

			if (this.options.enableCopyPasteExcel) {
				const copyPastePlugin = new Slick.CopyPasteManager({
					//runtimeDataService: platformRuntimeDataService,
					$injector: this.injector,
					//accounting: accounting,
					//contextService: platformContextService,
					//languageService: platformLanguageService
				});

				if(copyPastePlugin) {
					copyPastePlugin.init(this.grid);

					if (this.options.allowCopySelection) {
						this.registerPlugin('CopyPasteManager',copyPastePlugin);
						copyPastePlugin.enableSelection(this.grid);
					}
				}
			}

			if(this.options.dragDropAllowed){
				const moveRowsPlugin = new Slick.RowMoveManager({
					cancelEditOnDrag: true
				});
				this.registerPlugin( 'RowMoveManager', moveRowsPlugin);
				this.grid?.onDragStart.subscribe(this.onDragStart);
				this.grid?.onDragEnd.subscribe(this.onDragEnd);
			}

			// TODO: is this line still required?
			//const batchCopyPlugin = new Slick.BatchCopyManager({});

			this.registerPlugin('AutoTooltips', new Slick.AutoTooltips({maxToolTipLength: 800}));

			const columnGroupPlugin = new Slick.ColumnGroup();

			if(columnGroupPlugin) {
				this.registerPlugin('ColumnGroup',columnGroupPlugin);
				columnGroupPlugin.init(this.grid);
			}
			/* End Slickgrid Plugins */

			/* Start Slickgrid DataView Events */

			/* End Slickgrid DataView Events */

			this.grid?.onHeaderClick.subscribe(this.onHeaderClick);
			this.grid?.onClick.subscribe(this.onClick);
			this.grid?.onDblClick.subscribe((e, args: IDblClickEventArgs<T>) => {
				const api = this.grid?.getOptions().api;
				const item = this.grid?.getDataItem(args.row);
				api?.doubleClick.emit(new MouseEvent(e, args.row, args.cell, item));
			});

			//registerEvent(obj.id, 'onDragInit', onDragInit);
			//registerEvent(obj.id, 'onColumnsReordered', onColumnsReordered);
			//registerEvent(obj.id, 'onColumnsResized', onColumnsResized);
			//registerEvent(obj.id, 'onBeforeCellEditorDestroy', onBeforeCellEditorDestroy);

			//registerEvent(obj.id, 'onBeforeEditCell', onBeforeEditCell);
			//registerEvent(obj.id, 'onBatchCopyComplete', onBatchCopyComplete);

			this.grid?.setHeaderRowVisibility(this.options.showColumnSearchPanel ? this.options.showColumnSearchPanel : false);
		});
	}

	/**
	 * Header click event callback called by slickgrid
	 * @param e
	 * @param args
	 * @private
	 */
	private onHeaderClick(e: Event, args: IHeaderClickEventArgs<T>): void {
		if (e.target) {
			if ($(e.target).hasClass('indicator')) {
				const grid = args.grid;
				if (grid.getEditorLock().isActive() && !grid.getEditorLock().commitCurrentEdit()) {
					e.preventDefault();
					e.stopImmediatePropagation();
					return;
				}
				const selections = grid.getSelectedRows();
				const len = grid.getDataLength();

				if (selections.length > 0 && selections.length === len) {
					grid.setSelectedRows([]);
				} else {
					const rows = [];
					for (let i = 0; i < len; i++) {
						rows.push(i);
					}
					grid.resetActiveCell();
					grid.setSelectedRows(rows);
				}
			}
		}
	}


	/**
	 * click event callback called by slickgrid
	 * @param e
	 * @param args
	 * @private
	 */
	private onClick(e: Event, args: IClickEventArgs<T>) : void {
		if(e.target) {
			const grid = args.grid;
			const api = grid.getOptions().api;
			const item = grid.getDataItem(args.row);
			if ($(e.target).hasClass('toggle')) {

				if (item) {
					const selected = grid.getSelectedRows();
					const selRows = [];

					// Trigger Expanding/Collapsing event
					api?.treeNodeChanging.emit(new TreeNodeEvent(item, item.nodeInfo.collapsed ? TreeNodeEventType.Expand : TreeNodeEventType.Collapse));

					grid.getData().toggleNode(item);

					// Trigger Expanded/Collapsed event
					api?.treeNodeChanged.emit(new TreeNodeEvent(item, item.nodeInfo.collapsed ? TreeNodeEventType.Expand : TreeNodeEventType.Collapse));

					if (selected && selected.length > 0) {
						selRows.push(args.row);
					}

					grid.resetActiveCell();
					grid.setSelectedRows(selRows);
					grid.invalidate();
				}
				e.stopImmediatePropagation();
			}
			api?.mouseClick.emit(new MouseEvent(e, args.row, args.cell, item));
		}
	}

	/**
	 * drag start event callback called by slickgrid
	 * @param e
	 * @param args
	 * @private
	 */
	private onDragStart(e: Event, args: IClickEventArgs<T>): void {
		const grid = args.grid;
		const api = grid.getOptions().api;
		const cell = grid.getCellFromEvent(e);
		if (!cell) {
			return;
		}

		const singleItem = grid.getDataItem(cell.row);
		const selectedRows = grid.getSelectedRows();
		const items: T[] = [];

		if (selectedRows.indexOf(cell.row) === -1) {
			grid.setSelectedRows([cell.row]);
			grid.gotoCell(cell.row, 0, false);
		}

		if (selectedRows.length > 1) {
			for (const row of selectedRows) {
				const item = grid.getDataItem(row);
				if (item) {
					items.push(item);
				}
			}
		} else if (singleItem) {

			items.push(singleItem);
		}

		if (items.length === 0) {
			return;
		}

		e.stopImmediatePropagation();

		const draggedData = {
			type: grid.getOptions().uuid,
			data: items,
		} as unknown as IDraggedDataInfo<T>;

		api?.dragStart.emit(draggedData);
	}

	/**
	 * drag end event callback called by slickgrid
	 * @param e
	 * @param args
	 * @private
	 */
	private onDragEnd(e: Event, args: IClickEventArgs<T>): void {
		const grid = args.grid;
		const api = grid.getOptions().api;

		e.stopImmediatePropagation();
		grid.clearHighlightRows();

		api?.dragEnd.emit();
	}

	private isReadonly(): boolean {
		if (this.options.skipPermissionCheck) {
			return false;
		}
		const uuid = this.config.uuid || this.grid?.getUuid();
		const permissionUuid = get(this.containers.find(container => container.uuid === uuid), 'permission', uuid);

		if(permissionUuid?.length === 32) {
			return !this.permissionService.hasWrite(permissionUuid);
		}

		throw new Error('grid-host::isReadonly: uuid used permission checks must be provided and must have length of 32');
	}
}
