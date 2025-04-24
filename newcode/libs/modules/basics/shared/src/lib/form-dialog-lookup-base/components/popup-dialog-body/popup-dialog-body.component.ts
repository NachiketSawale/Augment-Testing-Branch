/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, DestroyRef, inject, Injector, OnInit } from '@angular/core';
import { getCustomDialogLookupContextToken, ICustomDialogLookupContext } from '../../';
import {
	ActivePopup,
	ColumnDef,
	IGridConfiguration, ILookupContext,
	ILookupReadonlyDataService,
	ILookupSearchRequest,
	LookupSearchRequest
} from '@libs/ui/common';
import { MinimalEntityContext } from '@libs/platform/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'basics-shared-popup-dialog-body',
	templateUrl: './popup-dialog-body.component.html',
	styleUrls: ['./popup-dialog-body.component.scss']
})
export class BasicsSharedPopupDialogBodyComponent<TItem extends object, TEntity extends object> implements OnInit {
	private injector = inject(Injector);
	private activePopup = inject(ActivePopup);
	private destroyRef = inject(DestroyRef);
	private context: ICustomDialogLookupContext<TItem, TEntity> = inject(getCustomDialogLookupContextToken<TItem, TEntity>());

	public dataService!: ILookupReadonlyDataService<TItem, object>;
	public columns!: ColumnDef<TItem>[];
	public configuration!: IGridConfiguration<TItem>;
	public selectedItem?: TItem;
	public searchRequest!: ILookupSearchRequest;
	public loading: boolean = false;

	/**
	 *
	 */
	public ngOnInit() {
		this.initialize();
	}

	private initializeGrid(columns: ColumnDef<TItem>[], items: TItem[]) {
		this.configuration = {
			uuid: this.context.options?.uuid,
			columns: columns,
			items: items
		};
	}

	/**
	 *
	 */
	public initialize() {
		const contextOptions = this.context.options;

		if (!contextOptions?.dataService && !contextOptions?.dataServiceToken) {
			throw new Error('data service not found!');
		}

		// Data service
		this.dataService = (contextOptions?.dataService ?? (contextOptions.dataServiceToken ? this.injector.get(contextOptions.dataServiceToken) : {})) as ILookupReadonlyDataService<TItem, object>;

		// Columns
		this.columns = contextOptions?.popupOptions?.options?.config?.columns as ColumnDef<TItem>[];

		// Search request
		this.searchRequest = new LookupSearchRequest('', this.columns.filter(col => {
			return col.searchable;
		}).map(col => col.model as string));

		if (contextOptions.serverSideFilter) {
			const context = new MinimalEntityContext();
			context.entity = this.context.entity as TEntity;
			const filter = contextOptions.serverSideFilter.execute(context as ILookupContext<TItem, TEntity>);
			this.searchRequest.filterKey = contextOptions.serverSideFilter.key;
			this.searchRequest.additionalParameters = filter;
		}

		this.initializeGrid(this.columns, []);
		this.refresh();
	}

	/**
	 *
	 */
	public refresh() {
		this.searchRequest = {
			...this.searchRequest
		};
		this.loading = true;
		this.dataService.getSearchList(this.searchRequest).pipe(
			takeUntilDestroyed(this.destroyRef)
		).subscribe(response => {
			this.initializeGrid(this.columns, response.items);
			this.loading = false;
		});
	}

	/**
	 *
	 * @param selectedItems
	 */
	public selectionChanged(selectedItems: TItem[]) {
		if (selectedItems.length > 0) {
			this.selectedItem = selectedItems[0];
			this.activePopup.close({
				apply: true,
				result: this.selectedItem
			});
		}
	}

}
