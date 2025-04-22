/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { CellChangeEvent, GridApiService, IGridApi, IGridConfiguration, IMenuItemsList, IResizeOptions } from '@libs/ui/common';

@Component({
	selector: 'procurement-pricecomparison-compare-setting-base-grid',
	templateUrl: './compare-setting-base-grid.component.html',
	styleUrls: ['./compare-setting-base-grid.component.scss'],
})
export class ProcurementPricecomparisonCompareSettingBaseGridComponent<T extends object> implements AfterViewInit {
	private readonly gridApiSvc = inject(GridApiService);

	public ngAfterViewInit(): void {
		this.currGrid.selectionChanged.subscribe(v => {
			this.selectionChanged.next(v);
		});

		this.currGrid.cellChanged.subscribe(v => {
			this.cellChanged.next(v);
		});

		this.currGrid.itemsChanged.subscribe(v => {
			this.itemsChanged.next({
				items: v,
				grid: this.currGrid
			});
		});
	}

	private get currGrid() {
		return this.gridApiSvc.get<T>(this.config.uuid as string);
	}

	public resizeOptions: IResizeOptions = {
		debounce: 100,
		handler: {
			execute: (args) => {
				// TODO-DRIZZLE: To be checked, how to known the grid host is ready?
				// this.currGrid.resizeGrid();
			}
		}
	};

	@Input({required: false})
	public title?: Translatable;

	@Input({required: false})
	public menu?: IMenuItemsList;

	@Input({required: true})
	public config!: IGridConfiguration<T>;

	@Output()
	public selectionChanged: EventEmitter<T[]> = new EventEmitter<T[]>();

	@Output()
	public cellChanged: EventEmitter<CellChangeEvent<T>> = new EventEmitter<CellChangeEvent<T>>();

	@Output()
	public itemsChanged: EventEmitter<{ items: T[], grid: IGridApi<T> }> = new EventEmitter<{ items: T[], grid: IGridApi<T> }>();
}
