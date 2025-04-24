/*
 * Copyright(c) RIB Software GmbH
 */

import { differenceBy, uniqBy } from 'lodash';
import { Subject } from 'rxjs';
import { inject } from '@angular/core';
import { IEntityIdentification, PlatformTranslateService } from '@libs/platform/common';
import {
	IEntityFilterDefinition,
	IEntityFilterExpression,
	IEntityFilterInput,
	IEntityFilterListItem,
	IEntityFilterOutput,
	IEntityFilterProfileEntity,
	IEntityFilterResultViewConfig
} from './interfaces';
import { EntityFilterAccessLevel, EntityFilterSource } from './enums';
import { ENTITY_FILTER_ATTRIBUTE_EXTENSION, ENTITY_FILTER_LIST_EXTENSION, ENTITY_FILTER_SEARCH_FIELD_EXTENSION, IEntityFilterSearchField } from './extensions';

/**
 * The scope of entity filter view.
 */
export abstract class EntityFilterScope<TEntity extends IEntityIdentification> {
	/**
	 * Translation service
	 */
	public readonly translateService = inject(PlatformTranslateService);

	/**
	 * Attribute extension
	 */
	public readonly attributeExtension = inject(ENTITY_FILTER_ATTRIBUTE_EXTENSION, {optional: true});

	/**
	 * Injected additional extension for the entity filter list, if any.
	 */
	public readonly listExtension = inject(ENTITY_FILTER_LIST_EXTENSION, {optional: true});

	/**
	 * Injected additional extension for the entity filter search field, if any.
	 */
	public readonly searchFieldExtension = inject(ENTITY_FILTER_SEARCH_FIELD_EXTENSION, {optional: true});

	/**
	 * Show search fields
	 */
	public showSearchFields = false;

	/**
	 * Search fields
	 */
	public searchFields: IEntityFilterSearchField[] = [];

	/**
	 * Filter input object
	 */
	public input: IEntityFilterInput = this.getInitialInput();

	/**
	 * Filter output object
	 */
	public output: IEntityFilterOutput<TEntity> = this.getInitialOutput();

	/**
	 * Filter output subject
	 */
	public output$ = new Subject<IEntityFilterOutput<TEntity>>();

	/**
	 * Current selected entity id
	 */
	public selectedId?: number;

	/**
	 * Selected entity
	 */
	public selectedItem?: TEntity;

	/**
	 * Selected entities
	 */
	public selectedItems: TEntity[] = [];

	/**
	 * Select entity subject
	 */
	public selected$ = new Subject<TEntity>();

	/**
	 * Current profile
	 */
	public currentProfile: IEntityFilterProfileEntity = {
		IsNew: true,
		FilterName: '',
		AccessLevel: EntityFilterAccessLevel.User,
		FilterValue: {
			Filters: [],
		},
	};

	/**
	 * Current filter definitions
	 */
	public currentFilterDefs: IEntityFilterDefinition[] = [];

	/**
	 * Whole filter definitions
	 */
	public filterDefs: IEntityFilterDefinition[] = [];

	/**
	 * Subject to emit when a filter request is made.
	 * This Subject will emit an `IEntityFilterDefinition` object whenever a filter request is made.
	 */
	public openFilterRequest$ = new Subject<IEntityFilterDefinition>();

	/**
	 * Page size option list
	 */
	public pageSizeList: number[] = [];

	/**
	 * Subject to emit when items updated.
	 */
	public itemsUpdated$ = new Subject<TEntity[]>();

	/**
	 * Whether it is loading
	 */
	public isLoading: boolean = false;

	/**
	 * Show loading icon
	 */
	protected showLoading() {
		this.isLoading = true;
	}

	/**
	 * Hide loading icon
	 */
	protected hideLoading() {
		this.isLoading = false;
	}

	/**
	 * Get initial input data
	 * @protected
	 */
	protected getInitialInput(): IEntityFilterInput {
		return {
			PageNumber: 1,
			PageSize: 50,
		};
	}

	/**
	 * Get initial output data
	 * @protected
	 */
	protected getInitialOutput(): IEntityFilterOutput<TEntity> {
		return {
			Entities: [],
			EntitiesFound: 0,
		};
	}

	/**
	 * Reset page to first page
	 */
	public resetPageNumber() {
		this.input.PageNumber = 1;
	}

	/**
	 * execute the entity filter
	 */
	public async executeFilter() {
		this.resetPageNumber();
		this.input.Filters = this.currentFilterDefs
			.filter((e) => e.Factors != null)
			.map((e) => {
				return {
					Id: e.Id,
					Source: e.Source,
					Type: e.Type,
					Operator: e.Operator,
					Factors: e.Factors,
				};
			});
		this.output = await this.postFilter();
		this.processOutput(this.output);
	}

	/**
	 * execute the entity filter by paging
	 */
	public async executePaging(pageNumber: number, pageSize: number) {
		this.input.PageNumber = pageNumber;
		this.updatePageSize(pageSize);

		this.output = await this.postFilter();
		this.processOutput(this.output);
	}

	/**
	 * Update page size
	 * @param newPageSize
	 */
	public updatePageSize(newPageSize: number) {
		if (this.input.PageSize !== newPageSize) {
			this.input.PageSize = newPageSize;
		}
	}

	/**
	 * Adds an attribute filter to the current filter definitions.
	 *
	 * @param {string} attribute - The attribute to be used for creating the filter definition.
	 * @throws {Error} Throws an error if the attribute extension is not found.
	 */
	public addAttributeFilter(attribute: string) {
		if (!this.attributeExtension) {
			throw new Error('Attribute extension not found');
		}

		this.addFilter(this.attributeExtension.createAttributeFilterDef(attribute));
	}

	/**
	 * Add filter
	 * @param filter
	 */
	public addFilter(filter: IEntityFilterDefinition) {
		if (this.currentFilterDefs.find((e) => e.Id === filter.Id)) {
			// if the filter is already added, open the filter
			this.openFilterRequest$.next(filter);
		} else {
			this.currentFilterDefs.push(filter);
			// open the filter after the current event loop when view has been updated
			setTimeout(() => {
				this.openFilterRequest$.next(filter);
			}, 0);
		}
	}

	/**
	 * Remove filter
	 * @param filter
	 */
	public removeFilter(filter: IEntityFilterDefinition) {
		// reset filter values
		filter.Factors = [];
		filter.PredefinedFactors = [];

		this.currentFilterDefs = differenceBy(this.currentFilterDefs, [filter], (e) => e.Id);
		this.executeFilter();
	}

	/**
	 * Clear filters
	 */
	public clearFilters() {
		this.currentFilterDefs = this.currentFilterDefs.filter((e) => e.Readonly);
	}

	/**
	 * Save filters
	 */
	public async saveFilters() {
		this.currentProfile.FilterValue = {
			Filters: uniqBy(this.currentFilterDefs, (e) => e.Id).map((e) => {
				return {
					Id: e.Id,
					Source: e.Source,
					Type: e.Type,
					Operator: e.Operator,
					Factors: e.Factors,
					PredefinedFactors: e.PredefinedFactors,
					Descriptions: e.Descriptions,
				};
			}),
		};

		return this.postProfile(this.currentProfile);
	}

	/**
	 * Apply profile
	 * @param profile
	 */
	public async applyProfile(profile: IEntityFilterProfileEntity) {
		this.currentProfile = profile;

		if (!profile.FilterValue) {
			this.currentFilterDefs = [];
			return;
		}

		this.updateCurrentDefs(profile.FilterValue.Filters);
		await this.executeFilter();
	}

	private updateCurrentDefs(filters: IEntityFilterExpression[]) {
		this.clearFilters();

		filters = differenceBy(filters, this.currentFilterDefs, (e) => e.Id);

		const filterDefs = uniqBy(filters, (e) => e.Id).map((e) => {
			let filterDef = this.filterDefs.find((f) => f.Id === e.Id);

			if (e.Source === EntityFilterSource.Attribute) {
				filterDef = this.createAttributeFilterDef(e.Id);
			}

			if (!filterDef) {
				throw new Error('Filter definition not found');
			}

			filterDef.Operator = e.Operator;
			filterDef.Factors = e.Factors;
			filterDef.PredefinedFactors = e.PredefinedFactors;
			filterDef.Descriptions = e.Descriptions;
			filterDef.Readonly = e.Readonly;

			return filterDef;
		});

		this.currentFilterDefs = this.currentFilterDefs.concat(filterDefs);
	}

	/**
	 * Create attribute filter definition
	 * @param attribute
	 * @protected
	 */
	protected createAttributeFilterDef(attribute: string): IEntityFilterDefinition {
		if (!this.attributeExtension) {
			throw new Error('Attribute extension not found');
		}

		return this.attributeExtension.createAttributeFilterDef(attribute);
	}

	/**
	 * Load search fields
	 */
	public async loadSearchFields() {
		if (!this.searchFieldExtension) {
			return;
		}

		this.showSearchFields = await this.searchFieldExtension.isShownSearchFields();

		if (!this.showSearchFields) {
			return;
		}

		this.searchFields = await this.searchFieldExtension.provideSearchFields();

		const config = await this.searchFieldExtension.loadSearchFieldConfig();

		if (config.ids.length > 0) {
			this.searchFields.forEach((e) => {
				e.selected = config.ids.includes(e.id);
			});
		} else {
			const fieldAll = this.searchFields.find((e) => e.isAll);

			if (fieldAll) {
				fieldAll.selected = true;
			}
		}
	}

	/**
	 * Applies the provided search fields and saves the configuration.
	 *
	 * @param {IEntityFilterSearchField[]} searchFields - The search fields to apply.
	 * @throws {Error} Throws an error if the search field extension is not provided.
	 */
	public async applySearchFields(searchFields: IEntityFilterSearchField[]) {
		if (!this.searchFieldExtension) {
			throw new Error('Search field extension is not provided');
		}

		this.searchFields = searchFields;

		const config = {
			ids: this.searchFields.filter((e) => e.selected).map((e) => e.id),
		};

		await this.searchFieldExtension.saveSearchFieldConfig(config);
	}

	/**
	 * Get label of selected search fields
	 * @protected
	 */
	public getSelectedSearchFieldsLabel() {
		if (!this.searchFields?.length) {
			return this.translateService.instant('basics.material.searchFields.all').text;
		}

		return this.searchFields
			.filter((e) => e.selected)
			.map((e) => this.translateService.instant(e.description).text)
			.join(', ');
	}

	/**
	 * Result view option
	 */
	public abstract resultViewOption: IEntityFilterResultViewConfig<TEntity>;

	/**
	 * Post filter input to backend
	 * @protected
	 */
	protected abstract postFilter(): Promise<IEntityFilterOutput<TEntity>>;

	/**
	 * Post current profile to backend
	 * @protected
	 */
	protected abstract postProfile(profile: IEntityFilterProfileEntity): Promise<boolean>;

	/**
	 * Load filter definitions
	 * @protected
	 */
	public abstract loadFilterDefs(): Promise<void>;

	/**
	 * Load saved filters
	 * @protected
	 */
	public abstract loadSavedFilters(): Promise<IEntityFilterProfileEntity[]>;

	/**
	 * Output handler
	 * @param output
	 * @protected
	 */
	protected abstract processOutput(output: IEntityFilterOutput<TEntity>): void;

	/**
	 * Load display items of filter
	 * @param definition
	 * @param missingFactors
	 */
	public abstract loadDisplayItemsOfFilter(definition: IEntityFilterDefinition, missingFactors: unknown[]): Promise<IEntityFilterListItem[]>;

	/**
	 * Get label of each filter
	 * @param definition
	 */
	public abstract getFilterLabel(definition: IEntityFilterDefinition): string;

	/**
	 * Load result view required data
	 */
	public abstract loadResultViewRequiredData(): Promise<void>;

	/**
	 * Handle selection changed
	 * @param entity
	 */
	public abstract handleSelectionChanged(entity?: TEntity | null): void;

	/**
	 * Handle header checkbox changed
	 * @param isChecked
	 */
	public abstract handleHeaderCheckboxChanged(isChecked: boolean): void;
}