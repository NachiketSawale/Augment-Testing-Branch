/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Injector, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { getCustomDialogLookupContextToken, getCustomDialogOptionToken, ICustomDialogLookupContext } from './../../';
import {
	ColumnDef,
	getCustomDialogDataToken,
	IEditorDialog,
	IFormConfig, IGridConfiguration,
	ILookupReadonlyDataService,
	ILookupSearchRequest,
	LookupSearchRequest, StandardDialogButtonId
} from '@libs/ui/common';
import { ICustomSearchDialogOptions, ISearchEntity, ISearchResult } from '../../';
import { ITranslatable } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
	selector: 'basics-shared-search-dialog-body',
	templateUrl: './search-dialog-body.component.html',
	styleUrls: ['./search-dialog-body.component.scss']
})
export class BasicsSharedSearchDialogBodyComponent<TItem extends object, TEntity extends object> implements OnInit, AfterViewInit {
	private injector = inject(Injector);
	private destroyRef = inject(DestroyRef);
	private dlgOptions: ICustomSearchDialogOptions<TItem, TEntity> = inject(getCustomDialogOptionToken<ISearchResult<TItem>, IEditorDialog<ISearchResult<TItem>>, ICustomSearchDialogOptions<TItem, TEntity>>());
	private readonly dlgWrapper = inject(getCustomDialogDataToken<ISearchResult<TItem>, BasicsSharedSearchDialogBodyComponent<ISearchResult<TItem>, TEntity>>());
	private context: ICustomDialogLookupContext<TItem, TEntity> = inject(getCustomDialogLookupContextToken<TItem, TEntity>());
	private searchFields!: string[];
	public dialogInfo!: IEditorDialog<ISearchResult<TItem>>;
	public dataService!: ILookupReadonlyDataService<TItem, object>;
	public formValue!: ISearchEntity;
	public columns: ColumnDef<TItem>[] = [];
	public selectedItem?: TItem;
	public configuration!: IGridConfiguration<TItem>;
	public loading: boolean = false;
	public searchRequest!: ILookupSearchRequest;

	@ViewChild('searchInput')
	private searchInput!: ElementRef;

	/**
	 * Initialize data.
	 */
	public ngOnInit() {
		this.initialize();
	}

	/**
	 *
	 */
	public ngAfterViewInit() {
		setTimeout(() => {
			this.searchInput.nativeElement.focus();
		}, 300);
	}

	/**
	 *
	 * @private
	 */
	private initialize() {
		const contextOptions = this.context.options;
		const grid = this.dlgOptions.grid;

		// Data service
		if (!grid || (!contextOptions?.dataService && !contextOptions?.dataServiceToken)) {
			throw new Error('data service not found!');
		}

		this.dataService = (contextOptions?.dataService ?? (contextOptions.dataServiceToken ? this.injector.get(contextOptions.dataServiceToken) : {})) as ILookupReadonlyDataService<TItem, object>;

		// Search Fields
		if (!grid.config || _.isEmpty(grid.config.columns)) {
			throw new Error('grid columns not found!');
		}

		// Columns
		this.columns = grid.config.columns;
		this.initializeGrid(this.columns, []);

		this.searchFields = this.columns.filter(col => {
			return col.searchable;
		}).map(col => col.model as string);

		// Search value
		this.formValue = this.dlgWrapper.value?.formValue ?? {} as ISearchEntity;

		// Dialog info
		this.dialogInfo = (function createDialogInfoFn(owner: BasicsSharedSearchDialogBodyComponent<TItem, TEntity>): IEditorDialog<ISearchResult<TItem>> {
			return {
				get value(): ISearchResult<TItem> | undefined {
					return owner.dlgWrapper.value;
				},
				set value(v: ISearchResult<TItem>) {
					owner.dlgWrapper.value = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);
	}

	private initializeGrid(columns: ColumnDef<TItem>[], items: TItem[]) {
		this.configuration = {
			uuid: this.context.options?.uuid,
			columns: columns,
			items: items
		};
	}

	/**
	 * Advance criteria title.
	 */
	public get criteriaTitle(): ITranslatable {
		return this.dlgOptions.form?.title as ITranslatable;
	}

	/**
	 * The form configuration object applied in the form.
	 */
	public get formConfig(): IFormConfig<ISearchEntity> {
		return this.dlgOptions.form?.configuration as IFormConfig<ISearchEntity>;
	}

	/**
	 * Provide then entity runtime data that contains readonly fields and validation results etc.
	 */
	public get entityRuntimeData(): EntityRuntimeData<ISearchEntity> | undefined {
		return this.dlgOptions.form?.entityRuntimeData;
	}

	/**
	 *
	 * @param selectedItems
	 */
	public selectionChanged(selectedItems: TItem[]) {
		if (selectedItems.length > 0) {
			this.selectedItem = selectedItems[0];
			if (this.dlgWrapper.value) {
				this.dlgWrapper.value.selectedItem = this.selectedItem;
			}

			// if (doubleClick) {
			// 	const closeResult: IEditorDialogResult<ISearchResult<TItem>> = {
			// 		value: this.dialogInfo.value,
			// 		closingButtonId: 'ok'
			// 	};
			// 	TODO: How to close dialog in custom dialog body?
			// }
		}
	}

	/**
	 *
	 * @param searchValue
	 * @param event
	 */
	public search(searchValue: string, event: Event) {
		this.loading = true;

		this.searchRequest = new LookupSearchRequest(searchValue, this.searchFields);
		this.searchRequest.additionalParameters = _.mergeWith({
			searchDialog: true
		}, this.formValue);

		this.dataService.getSearchList(this.searchRequest).pipe(
			takeUntilDestroyed(this.destroyRef)
		).subscribe(response => {
			this.initializeGrid(this.columns, response.items);
			this.loading = false;
		});
		event.stopPropagation();
	}
}
