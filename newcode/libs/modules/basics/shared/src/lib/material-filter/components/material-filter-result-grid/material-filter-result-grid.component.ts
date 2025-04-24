/*
 * Copyright(c) RIB Software GmbH
 */
import { Subscription } from 'rxjs';
import { find, isNil, last } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';
import { IMaterialSearchEntity } from '../../../material-search';
import { BasicsSharedMaterialFilterResultColumnService } from '../../services';
import { IMaterialFilterOutput, MaterialFilterGridId, MaterialFilterScope } from '../../model';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ColumnDef, FieldValidationInfo, GridApiService, IGridConfiguration, MouseEvent } from '@libs/ui/common';
import { IEntityFilterOutput } from '../../../entity-filter';

/**
 * Material filter result grid component
 */
@Component({
	selector: 'basics-shared-material-filter-result-grid',
	templateUrl: './material-filter-result-grid.component.html',
	styleUrl: './material-filter-result-grid.component.scss',
})
export class BasicsSharedMaterialFilterResultGridComponent implements OnInit, OnDestroy {
	private readonly unSubscriptions: Subscription[] = [];
	private readonly gridApiService = inject(GridApiService);
	private readonly columnService = inject(BasicsSharedMaterialFilterResultColumnService);

	/**
	 * Search scope
	 * The scope defines the context in which the filters are applied.
	 */
	@Input()
	public scope!: MaterialFilterScope;

	/**
	 * Event selection changed
	 */
	@Output()
	public selectionChanged = new EventEmitter<IMaterialSearchEntity | null>();

	/**
	 * Filter result items
	 */
	public items: IMaterialSearchEntity[] = [];

	/**
	 * Whether search no result
	 */
	public isSearchNoResult: boolean = false;

	/**
	 * Grid config
	 */
	public gridConfig: IGridConfiguration<IMaterialSearchEntity> = {};

	/**
	 * initialization
	 */
	public ngOnInit(): void {
		this.initGridConfig();

		// Subscribe filter result
		this.unSubscriptions.push(this.scope.output$.subscribe(this.outputHandler.bind(this)));
	}

	/**
	 * Destroy
	 */
	public ngOnDestroy(): void {
		this.unSubscriptions.forEach((s) => s.unsubscribe());
	}

	private initGridConfig() {
		this.gridConfig = {
			uuid: MaterialFilterGridId,
			skipPermissionCheck: true,
			columns: this.getColumns()
		};
		this.items = this.scope.output?.Materials ?? [];
	}

	private outputHandler(output: IEntityFilterOutput<IMaterialSearchEntity>): void {
		const filterOutput = output as IMaterialFilterOutput;
		this.isSearchNoResult = !filterOutput?.Materials?.length;
		this.setItems(filterOutput?.Materials ?? []);
	}

	private setItems(items: IMaterialSearchEntity[]): void {
		this.setPriceListFk(items);
		this.items = items;
	}

	private getColumns() {
		const columns = this.columnService.getColumns();
		this.addValidator(columns);

		return columns;
	}

	private addValidator(columns: ColumnDef<IMaterialSearchEntity>[]) {
		const selectedColumn = find(columns, {id: 'selected'});

		selectedColumn!.validator = this.selectedValidator.bind(this);
	}

	private selectedValidator(info: FieldValidationInfo<IMaterialSearchEntity>) {
		info.entity.selected = info.value as boolean;
		this.scope.actionSelectedOrNot(info.entity);

		if (!this.scope.filterOptions?.isEnableMultiSelect && info.value) {
			this.items.forEach(i => {
				if (i.Id !== info.entity.Id) {
					i.selected = false;
				}
			});
			this.gridApiService.get(MaterialFilterGridId)?.refresh(true);
		}

		return new ValidationResult();
	}

	private setPriceListFk(items: IMaterialSearchEntity[]) {
		items.map((item: IMaterialSearchEntity) => {
			if (isNil(item.MaterialPriceListFk) && item.PriceLists?.length) {
				item.MaterialPriceListFk = item.PriceLists[0].Id;
			}
		});
	}

	/**
	 * Handle data selection changed
	 * @param selections
	 */
	public onSelectionChanged(selections: IMaterialSearchEntity[]) {
		this.selectionChanged.emit(selections.length ? last(selections) : null);
	}

	/**
	 * Handle double click item
	 * @param event
	 */
	public onDoubleClick(event: MouseEvent<IMaterialSearchEntity>) {
		this.scope.selected$.next(event.item);
	}
}