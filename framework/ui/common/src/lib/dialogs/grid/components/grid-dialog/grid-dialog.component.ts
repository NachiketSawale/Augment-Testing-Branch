/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';

import { getCustomDialogDataToken } from '../../../base';
import { getGridDialogDataToken } from '../../model/grid-dialog-data.interface';
import { GridItemId, IGridApi, IGridConfiguration } from '../../../../grid';
import { IGridDialogState } from '../../model/grid-dialog-state.interface';
import { IMenuItemsList } from '../../../../model/menu-list/interface/index';
import { IGridDialog } from '../../model/grid-dialog.interface';
import { IFieldValueChangeInfo } from '../../../../model/fields';

/**
 * Component renders the grid dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-grid-dialog',
	templateUrl: './grid-dialog.component.html',
	styleUrls: ['./grid-dialog.component.scss'],
})
export class GridDialogComponent<T extends object> implements AfterViewInit {
	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo;

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(getGridDialogDataToken<T>());

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IGridDialogState<T>, GridDialogComponent<T>>());

	/**
	 * Grid element reference.
	 */
	@ViewChild('gridElement') private readonly gridElementRef!: IGridApi<T>;

	public constructor() {
		this.dialogInfo = this.context;
	}

	public ngAfterViewInit(){
		this.setSelectedItems();
	}

	/**
	 * Set Default selected items.
	 */
	private setSelectedItems(){
		const selection = this.dialogWrapper.value?.selectedItems;

		if(!selection || !selection.length ){
			return;
		}

		const key = this.dialogData.gridConfig?.idProperty as keyof T;

		if(this.dialogWrapper.value?.items){
			this.gridElementRef.selection = this.dialogWrapper.value?.items.filter(ite=>this.dialogWrapper.value?.selectedItems.includes(ite[key] as GridItemId));
		}
	}

	/**
	 * Menulist Context
	 *
	 * @returns {IGridDialog<T>} Grid dialog data.
	 */
	public get context(): IGridDialog<T> {
		return (function createDialogContext(owner: GridDialogComponent<T>) {
			return {
				items: owner.dialogWrapper.value?.items as T[],
				selectedItems: owner.dialogWrapper.value?.selectedItems ?? [],
				close: owner.dialogWrapper.close,
				get gridRef():  IGridApi<T>{
					return owner.gridElementRef;
				},
			};
		})(this);
	}

	/**
	 * Used to prepared data required in grid integration.
	 */
	public get config(): IGridConfiguration<T> {
		return {...this.dialogData.gridConfig, items:this.dialogWrapper.value?.items};
	}

	/**
	 * Returns toolbar menulist data
	 *
	 * @returns { IMenulistItem<IGridDialog<T>> | undefined} Tools data.
	 */
	public get tools(): IMenuItemsList<IGridDialog<T>> | undefined {
		return this.dialogData.tools;
	}

	/**
	 * Returns title if present.
	 */
	public get title(){
		return this.dialogData.title;
	}

	/**
	 * Used to pass the selected data from the grid to the dataservice
	 *
	 * @param {T[]} selectedRows.
	 */
	public onSelectionChanged(selectedRows: T[]): void {
		if(!this.dialogWrapper.value){
			return;
		}

		this.dialogWrapper.value.selectedItems.length = 0;
		const key = this.dialogData.gridConfig?.idProperty as keyof T;

		selectedRows.forEach(row => this.dialogWrapper.value?.selectedItems.push(row[key] as GridItemId));
	}

	/**
	 * Triggered when property of an entity is changed.
	 *
	 * @param info Field value information
	 */
	public onValueChanged(info: IFieldValueChangeInfo<T>): void {
		if (this.dialogData.onCellValueChanged) {
			this.dialogData.onCellValueChanged(this.context, info);
		}
	}
}
