/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { get, isFunction, last } from 'lodash';
import { GridApiService, IGridConfiguration, MouseEvent } from '@libs/ui/common';
import { IEntityFilterOutput } from '../../model';
import { Subject, Subscription } from 'rxjs';
import { IEntityFilterResultGridConfig } from '../../model';

/**
 * Entity Filter Result Grid Component
 * Displays filtered results in a grid.
 */
@Component({
	selector: 'basics-shared-entity-filter-result-grid',
	templateUrl: './entity-filter-result-grid.component.html',
	styleUrl: './entity-filter-result-grid.component.scss'
})
export class BasicsSharedEntityFilterResultGridComponent<TEntity extends IEntityIdentification>
	implements OnInit, OnDestroy, AfterViewInit {
	private readonly unSubscriptions: Subscription[] = [];
	private readonly gridApiService = inject(GridApiService);

	/**
	 * Grid option
	 */
	@Input()
	public gridOption!: IEntityFilterResultGridConfig<TEntity>;

	/**
	 * Filter output subject
	 */
	@Input()
	public output$ = new Subject<IEntityFilterOutput<TEntity>>();

	/**
	 * Filter output subject
	 */
	@Input()
	public itemsUpdated$ = new Subject<TEntity[]>();

	/**
	 * Container of this component resize
	 */
	@Input()
	public containerResize = new EventEmitter<void>();

	/**
	 * Event of selection changed
	 */
	@Output()
	public selectionChanged = new EventEmitter<TEntity | undefined>();

	/**
	 * Event of header checkbox changed
	 */
	@Output()
	public headerCheckboxChanged = new EventEmitter<boolean>();

	/**
	 * Event of double click
	 */
	@Output()
	public doubleClick = new EventEmitter<TEntity>();

	/**
	 * Whether search no result
	 */
	public isFilterNoResult: boolean = false;

	/**
	 * Grid config
	 */
	public gridConfig: IGridConfiguration<TEntity> = {};

	/**
	 * Filtered results
	 */
	public items: TEntity[] = [];

	/**
	 * Initialization
	 */
	public ngOnInit(): void {
		this.initGridConfig();

		this.unSubscriptions.push(this.output$.subscribe(this.onHandleOutput.bind(this)));
		this.unSubscriptions.push(this.itemsUpdated$.subscribe(this.refreshGrid.bind(this)));
		this.unSubscriptions.push(this.containerResize.subscribe(this.resizeGrid.bind(this)));
	}

	public ngAfterViewInit() {
		this.subscribeHeaderCheckboxChanged();
	}

	/**
	 * Destroy
	 */
	public ngOnDestroy(): void {
		this.unSubscriptions.forEach((s) => s.unsubscribe());
	}

	/**
	 * Handle data selection changed
	 * @param selections
	 */
	public onSelectionChanged(selections: TEntity[]) {
		this.selectionChanged.emit(selections.length ? last(selections) : undefined);
	}

	/**
	 * Handle double click item
	 * @param event
	 */
	public onDoubleClick(event: MouseEvent<TEntity>) {
		this.doubleClick.emit(event.item);
	}

	/**
	 * Init grid config
	 * @private
	 */
	private initGridConfig() {
		this.gridConfig = {
			uuid: this.gridOption.gridId,
			skipPermissionCheck: true,
			globalEditorLock: false,
			columns: this.gridOption.gridColumns
		};
	}

	private onHandleOutput(newOutput: IEntityFilterOutput<TEntity>) {
		this.isFilterNoResult = !newOutput.Entities.length;
		this.items = newOutput.Entities;
		this.refreshGrid();
	}

	private subscribeHeaderCheckboxChanged() {
		// TODO DEV-37938, it's a workaround, grid component need a header checkbox changed event
		const headerCheckboxChangedSubscribe = get(this.gridApi, 'gridHostApi.grid.onHeaderCheckboxChanged.subscribe') as unknown as ((fn: (event: Event) => void) => void | undefined);
		if (isFunction(headerCheckboxChangedSubscribe)) {
			headerCheckboxChangedSubscribe((event: Event) => {
				const isChecked = !!get(event, 'target.checked');
				this.headerCheckboxChanged.next(isChecked);
			});
		}
	}

	private refreshGrid() {
		this.gridApi?.refresh(true);
	}

	private resizeGrid() {
		this.gridApi?.resizeGrid();
	}

	private get gridApi() {
		return this.gridApiService.get(this.gridOption.gridId);
	}
}