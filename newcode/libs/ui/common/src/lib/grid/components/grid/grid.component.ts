/*
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	AfterViewChecked,
	Component,
	ElementRef,
	EventEmitter,
	inject, Input, OnDestroy,
	Output,
	ViewChild,
	HostBinding
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IGridApi } from '../../model/grid-api.interface';
import { FieldValidator, IField, IFieldValueChangeInfo, FieldType } from '../../../model/fields';
import { GridApiService } from '../../services/grid-api.service';
import { IDraggedDataInfo, IEntityContext, IReadOnlyPropertyAccessor, isPropertyAccessor, isReadOnlyPropertyAccessor, PlatformDragDropService, PropertyPathAccessor, PropertyType } from '@libs/platform/common';
import { ColumnDef } from '../../model/column-def.type';
import { IGridConfiguration } from '../../model/grid-configuration.interface';
import { GridContainerType } from '../../model/grid-container-type.enum';
import { get } from 'lodash';
import { IReadOnlyEntityRuntimeDataRegistry, IFieldValidationResult, ValidationResult } from '@libs/platform/data-access';
import { TreeNodeEvent } from '../../model/events/tree-node-event.class';
import { MouseEvent } from '../../model/events/grid-mouse-event.class';
import { CellChangeEvent } from '../../model/events/cell-change-event.class';
import { ControlContextBase } from '../../../domain-controls/model/control-context-base.class';

export class GridControlContext<T extends object, P extends PropertyType = PropertyType> extends ControlContextBase<P, T> {

	/**
	 * Initializes a new instance and establishes access to the underlying field,
	 * depending on the {@link IField.model} property.
	 *
	 * @param owner The grid in which this context object is used.
	 * @param column The column definition.
	 * @param row
	 * @param entityContext A context object that provides some information on the entity object.
	 * @param entityRuntimeDataRegister
	 */
	public constructor(
		private readonly owner: IGridApi<T>,
		private readonly column: IField<T, P>,
		private row: T,
		public readonly entityContext: IEntityContext<T>,
		private readonly entityRuntimeDataRegister?: IReadOnlyEntityRuntimeDataRegistry<T>,
	) {
		super();

		if (isReadOnlyPropertyAccessor(column.model)) {
			this.valueAccessor = column.model;
			this.alwaysReadOnly = !isPropertyAccessor(this.valueAccessor);
		} else if (column.model) {
			this.valueAccessor = new PropertyPathAccessor(column.model) as IReadOnlyPropertyAccessor<T, P>;
			this.alwaysReadOnly = false;
		} else {
			this.valueAccessor = {
				getValue(): P | undefined {
					return undefined;
				}
			};
			this.alwaysReadOnly = true;
		}
	}

	/**
	 * Indicates whether the row is permanently read-only due to its value accessor.
	 */
	private readonly alwaysReadOnly: boolean;

	/**
	 * Wraps the access to the actual field. Depending on the row definition,
	 * this might also be an object that returns a constant value or that
	 * retrieves its data from another source.
	 */
	private readonly valueAccessor: IReadOnlyPropertyAccessor<T, P>;

	protected override get internalValue(): P | undefined {
		if (this.row) {
			return this.valueAccessor.getValue(this.row);
		}
		return undefined;
	}

	protected override set internalValue(v: P | undefined) {
		if (this.row && this.value !== v) {
			if (isPropertyAccessor<T, P>(this.valueAccessor)) {
				const changeInfo: IFieldValueChangeInfo<T, P> = {
					oldValue: this.valueAccessor.getValue(this.row),
					newValue: v,
					field: this.column,
					entity: this.row,
				};

				if (this.column.changing) {
					this.column.changing(changeInfo);
				}

				this.valueAccessor.setValue(this.row, v);

				this.owner.valueChanged.next(changeInfo as unknown as IFieldValueChangeInfo<T>);

				if (this.column.change) {
					this.column.change(changeInfo);
				}
			} else {
				throw new Error('GridControlContext: valueAccessor can\'t be used to assign new value');
			}
		}
	}

	protected override canSetValue(): boolean {
		if (this.row) {
			if (isPropertyAccessor<T, P>(this.valueAccessor)) {
				return super.canSetValue();
			} else {
				throw new Error('GridControlContext: valueAccessor can\'t be used to assign new value');
			}
		}

		return false;
	}

	protected override getValidator(): FieldValidator<T> | undefined {
		return this.column.validator;
	}

	public get entity(): T | undefined {
		return this.row;
	}

	public override get fieldId(): string {
		return this.column.id;
	}

	public get fieldType(): FieldType {
		return this.column.type;
	}

	public override get readonly(): boolean {
		if (this.alwaysReadOnly || this.column.readonly) {
			return true;
		}

		if (this.entityRuntimeDataRegister) {
			if (this.entityRuntimeDataRegister.isEntityReadOnly(this.row)) {
				return true;
			}

			if (typeof this.column.model === 'string') {
				const roRecord = this.entityRuntimeDataRegister.getEntityReadOnlyFields(this.row).find((ro) => ro.field === this.column.model);
				if (roRecord) {
					return roRecord.readOnly;
				}
			}
		}

		return false;
	}

	protected override get internalValidationResults(): ValidationResult[] {
		if (this.entityRuntimeDataRegister) {
			const validationResults: IFieldValidationResult<T>[] = this.entityRuntimeDataRegister.getValidationErrors(this.row);
			return validationResults.map((result) => {
				return result.result;
			});
		}

		return [];
	}

	[key: string]: unknown | undefined;
}

@Component({
	standalone: true,
	selector: 'ui-common-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss']
})
export class GridComponent<T extends object> implements IGridApi<T>, AfterViewChecked, AfterViewInit, OnDestroy {
	@HostBinding('class') private class = 'platform-grid';
	@ViewChild('gridHost')
	private gridHost!: ElementRef<HTMLElement>;
	private gridHostCreated = false;
	private gridHostApi!: IGridApi<T>;
	private containerType = GridContainerType.Undefined;
	private apiService = inject(GridApiService);
	private dragDropService = inject(PlatformDragDropService);

	// Declare the subscriptions
	private dragStartSubs: Subscription | undefined;
	private dragEndSubs: Subscription | undefined;
	private dragStateChangedSubs: Subscription | undefined;
	private mouseEnterSubs: Subscription | undefined;
	private mouseLeaveSubs: Subscription | undefined;

	public ngAfterViewChecked(): void {
		if(this.gridHost?.nativeElement?.children.length === 0) {
			this.gridHostCreated = false;
			this.insertGridHostComponent(this.configuration);
		}
	}

	public ngAfterViewInit(): void {
		const containerHost = this.gridHost?.nativeElement?.parentNode?.parentNode?.parentNode;

		if (!this.configuration.containerType) {
			if (containerHost && containerHost.querySelector('.subview-container') !== null) {
				this.containerType = GridContainerType.Container;
			} else if (containerHost && containerHost.querySelector('#grid-config') !== null) {
				this.containerType = GridContainerType.Configurator;
			}

			this.configuration.containerType = this.containerType;
		}

		this.configuration.containerType = this.containerType;
		this.insertGridHostComponent(this.configuration);

		if(this.configuration.dragDropAllowed){
			this.handleDragDropService(this.configuration);
		}
	}

	public ngOnDestroy(): void {
		this.removeGridHostComponent(this.configuration);
		if (this.dragStartSubs) {
			this.dragStartSubs.unsubscribe();
		}
		if (this.dragEndSubs) {
			this.dragEndSubs.unsubscribe();
		}
		if (this.dragStateChangedSubs) {
			this.dragStateChangedSubs.unsubscribe();
		}
		if (this.mouseEnterSubs) {
			this.mouseEnterSubs.unsubscribe();
		}
		if (this.mouseLeaveSubs) {
			this.mouseLeaveSubs.unsubscribe();
		}
	}

	public hostInitialized(gridHostApi: IGridApi<T>) {
		this.gridHostApi = gridHostApi;
	}

	private insertGridHostComponent(config: IGridConfiguration<T>) {
		if (!this.gridHostCreated && config.uuid && config.uuid.length === 32 && config.uuid !== '00000000000000000000000000000000') {
			const element = document.createElement('custom-ui-grid-host');

			this.apiService.register(config.uuid, this as IGridApi<T>);
			element.setAttribute('uuid', config.uuid);
			this.gridHost.nativeElement.appendChild(element);
			this.gridHostCreated = true;
		}
	}

	private removeGridHostComponent(config: IGridConfiguration<T>) {
		if (this.gridHostCreated) {
			this.gridHost?.nativeElement?.children[0]?.remove();
			this.gridHostCreated = false;
			if (config.uuid) {
				this.apiService.unregister(config.uuid);
			}
		}
	}

	private handleDragDropService(config: IGridConfiguration<T>){
		if(config.uuid){
			// Subscribe to dragStart event
			this.dragStartSubs =this.gridHostApi.dragStart.subscribe((draggedData) => {
				this.dragDropService.startDrag(draggedData);
			});
			// Subscribe to dragEnd event
			this.dragEndSubs = this.gridHostApi.dragEnd.subscribe(() => {
				this.dragDropService.endDrag();
			});
			this.dragStateChangedSubs = this.dragDropService.registerDragStateChanged((state) => {
					if(!this.dragDropService.isDragging()) {
						this.gridHostApi.clearHighlightRow();
					}
				});
			// Subscribe to mouseEnter (grid cell) event
			this.mouseEnterSubs = this.gridHostApi.mouseEnter.subscribe((mouseEvent) => {
				if(this.dragDropService.isDragging()){
					this.gridHostApi.highlightRows([mouseEvent.row]);
					const dropTargetObj: object[] = [mouseEvent.item as object];
					this.dragDropService.currentTargetDataChanged(dropTargetObj);
				}
			});
			// Subscribe to mouseLeave (grid cell) event
			this.mouseLeaveSubs = this.gridHostApi.mouseLeave.subscribe((mouseEvent) => {
				if(this.dragDropService.isDragging()) {
					this.gridHostApi.clearHighlightRow();
					this.dragDropService.currentTargetDataChanged(null);
				}
			});
		}
	}


	private config: IGridConfiguration<T> = {
		uuid: '00000000000000000000000000000000',
		columns: [] as ColumnDef<T>[],
		items: [] as T[],
	};

	@Input()
	public set configuration(config: IGridConfiguration<T>) {
		const newConfig = {...this.config, ...config, containerType: this.containerType};

		if (this.gridHost) {
			const recreate = Object.keys(config).reduce((result, property) => {
				if (property !== 'columns' && property !== 'items') {
					return result || get(this.config, property) !== get(config, property);
				}
				return result;
			}, false);

			if (recreate) {
				this.removeGridHostComponent(this.config);
				this.insertGridHostComponent(newConfig);
			}
		}

		this.config = newConfig;
		if(this.gridHostCreated) {
			this.gridHostApi.configuration = newConfig;
		} else {
			this.configurationChanged.next(newConfig);
		}
	}

	public get configuration(): IGridConfiguration<T> {
		return {...this.config};
	}

	/**
	 * grid initialized
	 */
	@Output()
	public readonly initialized = new BehaviorSubject<boolean>(false);

	/**
	 * Returns the maximum tree level
	 */
	public getMaxTreeLevel(): number {
		return this.gridHostApi.getMaxTreeLevel();
	}

	/**
	 * Method to scroll row containing item into view
	 * @param item object
	 * @param forceEdit boolean. If true, forces the row into edit mode
	 */
	public scrollRowIntoViewByItem(item: T, forceEdit: boolean): void {
		return this.gridHostApi.scrollRowIntoViewByItem(item, forceEdit);
	}

	/**
	 * Returns columns available to the grid
	 */
	public get columns(): ColumnDef<T>[] {
		return this.config.columns || [];
	}

	/**
	 * Sets columns available to the grid
	 */
	public set columns(columns: ColumnDef<T>[]) {
		this.gridHostApi.columns = columns;
	}

	/**
	 * Hidden columns which are not shown in the grid
	 */
	public get hiddenColumns(): ColumnDef<T>[] {
		return this.gridHostApi.hiddenColumns;
	}

	/**
	 * Columns which are visible in the grid
	 */
	public get visibleColumns(): ColumnDef<T>[] {
		return this.gridHostApi.visibleColumns;
	}

	/**
	 * Method to update column/columns in the grid
	 * @param columns object or array of objects of IField types
	 */
	public updateColumns(columns: ColumnDef<T> | ColumnDef<T>[]): void {
		this.gridHostApi.updateColumns(columns);
	}


	/**
	 * Method to show/hide the column search row in the grid
	 */
	public columnSearch() {
		this.gridHostApi.columnSearch();
	}

	/**
	 * Method to show/hide the standard search panel in the grid
	 */
	public searchPanel() {
		this.gridHostApi.searchPanel();
	}

	/**
	 * Method to show/hide the group panel in the grid
	 */
	public groupPanel() {
		this.gridHostApi.groupPanel();
	}

	/**
	 * Tree method to expand the node provided
	 * @param node
	 */
	public expand(node: T) {
		this.gridHostApi.expand(node);
	}

	/**
	 * Tree method to collapse the node provided
	 * @param node
	 */
	public collapse(node: T) {
		this.gridHostApi.collapse(node);
	}
	/**
	 * Tree method to expand all nodes in grid
	 */
	public expandAll(level?: number) {
		this.gridHostApi.expandAll(level);
	}

	/**
	 * Tree method to collapse all nodes in grid
	 */
	public collapseAll() {
		this.gridHostApi.collapseAll();
	}

	/**
	 * Method to resize grid
	 */
	public resizeGrid() {
		this.gridHostApi.resizeGrid();
	}

	/**
	 * Invalidates single/multiple data items or the complete grid
	 * Updates the UI for given items (grid rows) or whole grid
	 * @param items optional list of items to be invalidated otherwise invalidate whole grid
	 */
	public invalidate(items?: T[] | T): void {
		this.gridHostApi.invalidate(items);
	}

	/**
	 * Executes an internal refresh and optionally invalidates the grid
	 * @param invalidate optional, if true an invalidate is executed as well
	 */
	public refresh(invalidate?: boolean): void {
		this.gridHostApi.refresh(invalidate);
	}

	/**
	 * Highlight rows
	 */
	public highlightRows(row: number[]) {
		this.gridHostApi.highlightRows(row);
	}

	/**
	 * Clear highlight row
	 */
	public clearHighlightRow() {
		this.gridHostApi.clearHighlightRow();
	}

	/**
	 * Returns current selection
	 */
	public get selection(): T[] {
		return this.gridHostApi.selection;
	}

	/**
	 * Updates selection
	 */
	public set selection(items: T[]) {
		this.gridHostApi.selection = items;
	}

	private _entity!: T;

	/**
	 * Returns the entity object to edit in the grid.
	 */
	public get entity(): T {
		if (this.gridHost) {
			return this.gridHostApi.entity as T;
		}

		return this._entity;
	}

	/**
	 * Sets the entity object to edit in the grid.
	 */
	public set entity(item: T) {
		this._entity = item;

		if (this.gridHost) {
			this.gridHostApi.entity = item;
		}
	}

	/**
	 * Returns items in the grid
	 */
	public get items(): T[] {
		return this.config.items || [];
	}

	/**
	 * Sets items shown in the grid
	 */
	@Input()
	public set items(items: T[]) {
		this.configuration = {...this.config, items: items};
	}

	/**
	 * Event triggered when selection in the grid changes
	 */
	@Output()
	public readonly selectionChanged: EventEmitter<T[]> = new EventEmitter<T[]>();

	/**
	 * Event triggered when the items in the grid changes
	 */
	@Output()
	public readonly itemsChanged: EventEmitter<T[]> = new EventEmitter<T[]>();

	/**
	 * Event triggered when selection in the grid changes
	 */
	@Output()
	public readonly configurationChanged: BehaviorSubject<IGridConfiguration<T>> = new BehaviorSubject<IGridConfiguration<T>>(this.config);

	/**
	 * Event triggered when the number of levels of the tree changes due to the
	 * adding/deleting of elements
	 */
	@Output()
	public readonly treeLevelChanged: EventEmitter<number> = new EventEmitter<number>();

	/**
	 * Event triggered when a tree node is collapsing or expanding
	 */
	@Output()
	public readonly treeNodeChanging: EventEmitter<TreeNodeEvent<T>> = new EventEmitter<TreeNodeEvent<T>>();

	/**
	 * Event triggered when a tree node has been collapsed or expanded
	 */
	@Output()
	public readonly treeNodeChanged: EventEmitter<TreeNodeEvent<T>> = new EventEmitter<TreeNodeEvent<T>>();

	/**
	 * Event triggered when a property of an entity has been changed
	 */
	@Output()
	public readonly valueChanged: EventEmitter<IFieldValueChangeInfo<T>> = new EventEmitter<IFieldValueChangeInfo<T>>();

	/**
	 * Event triggered when click in the grid occurs
	 */
	@Output()
	public readonly mouseClick: EventEmitter<MouseEvent<T>> = new EventEmitter<MouseEvent<T>>();

	/**
	 * Event triggered when the mouse enters the grid
	 */
	@Output()
	public readonly mouseEnter: EventEmitter<MouseEvent<T>> = new EventEmitter<MouseEvent<T>>();

	/**
	 * Event triggered when the mouse leaves the grid
	 */
	@Output()
	public readonly mouseLeave: EventEmitter<MouseEvent<T>> = new EventEmitter<MouseEvent<T>>();

	/**
	 * Event trigger when mouse double clicks in grid
	 */
	@Output()
	public readonly doubleClick: EventEmitter<MouseEvent<T>> = new EventEmitter<MouseEvent<T>>();

	/**
	 * Event triggered when the grid cell changes
	 */
	@Output()
	public readonly cellChanged: EventEmitter<CellChangeEvent<T>> = new EventEmitter<CellChangeEvent<T>>();

	/**
	 * Event trigger when mouse drag starts in grid
	 */
	@Output()
	public readonly dragStart: EventEmitter<IDraggedDataInfo<T>> = new EventEmitter<IDraggedDataInfo<T>>();

	/**
	 * Event trigger when mouse drag ends in grid
	 */
	@Output()
	public readonly dragEnd: EventEmitter<IDraggedDataInfo<T>> = new EventEmitter<IDraggedDataInfo<T>>();
}