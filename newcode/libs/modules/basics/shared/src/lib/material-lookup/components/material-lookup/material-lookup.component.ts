/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { getCustomDialogDataToken, LookupContext, ILookupViewResult, ILookupDialogView } from '@libs/ui/common';

import { IMaterialSearchEntity } from '../../../material-search';
import { BasicsSharedMaterialFilterComponent, BasicsSharedMaterialFilterService, IMaterialFilterInput, MATERIAL_FILTER_OPTIONS } from '../../../material-filter';

/**
 * Material lookup view
 */
@Component({
	selector: 'basics-shared-material-lookup',
	templateUrl: './material-lookup.component.html',
	styleUrls: ['./material-lookup.component.scss'],
})
export class BasicsSharedMaterialLookupComponent<TEntity extends object> implements AfterViewInit, OnInit, ILookupDialogView<IMaterialSearchEntity> {
	private readonly lookupContext = inject(LookupContext<IMaterialSearchEntity, TEntity>);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<IMaterialSearchEntity>, BasicsSharedMaterialLookupComponent<TEntity>>());
	public readonly filterOptions = inject(MATERIAL_FILTER_OPTIONS, {optional: true});

	/**
	 * Filter component reference
	 */
	@ViewChild('filter', { read: BasicsSharedMaterialFilterComponent })
	public filter!: BasicsSharedMaterialFilterComponent;

	/**
	 * Custom material filter service
	 */
	public filterService? = inject(BasicsSharedMaterialFilterService);

	/**
	 * Filter input object
	 */
	public filterInput?: Partial<IMaterialFilterInput>;

	/**
	 * Focused Item getter
	 */
	public get focusedItem() {
		return this.filter.scope.selectedItem;
	}

	/**
	 * Focused Item setter
	 * @param value
	 */
	public set focusedItem(value: IMaterialSearchEntity | undefined) {
		this.filter.scope.selectedItem = value;
	}

	/**
	 * Refresh data
	 */
	public refresh() {
		this.filter.scope.executeFilter();
	}

	/**
	 * Apply selected material
	 * @param dataItem
	 */
	public apply(dataItem?: IMaterialSearchEntity) {
		this.dialogWrapper.value = {
			apply: true,
			result: dataItem || this.focusedItem,
		};

		this.dialogWrapper.close('ok');
	}

	/**
	 * initialization
	 */
	public ngOnInit() {
		setTimeout(async () => {
			await this.initFilterInput();
			this.initSelectedMaterial();
			this.initFilterOptions();
		});
	}

	/**
	 * After view initialized
	 */
	public ngAfterViewInit() {
		this.filter.scope.selected$.subscribe((e) => {
			this.apply(e);
		});
	}

	private initSelectedMaterial() {
		if (this.lookupContext.selectedId) {
			this.filter.scope.selectedId = this.lookupContext.selectedId.id;
			this.filter.scope.initData(this.filter.scope.selectedId);
			this.filter.scope.initFilter();
		}
	}

	private async initFilterInput() {
		const lookupConfig = this.lookupContext.lookupConfig;
		let serverSideFilter = lookupConfig.serverSideFilter;

		if (!serverSideFilter && lookupConfig.serverSideFilterToken) {
			serverSideFilter = this.lookupContext.injector.get(lookupConfig.serverSideFilterToken);
		}

		if (serverSideFilter) {
			this.filterInput = (await serverSideFilter.execute(this.lookupContext)) as Partial<IMaterialFilterInput>;
		}
	}

	private initFilterOptions() {
		this.filter.scope.initFilterOptions(this.filterOptions);
	}
}
