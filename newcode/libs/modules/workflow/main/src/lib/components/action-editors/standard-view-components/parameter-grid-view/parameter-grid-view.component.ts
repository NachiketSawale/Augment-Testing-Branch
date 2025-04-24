/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { ConcreteMenuItem, IFieldValueChangeInfo, ItemType, MenuListContent } from '@libs/ui/common';
import { IGridView } from '../../../../model/interfaces/action-editor/grid-view-properties.interface';

/**
 * Default columns that will be added to the grid.
 */
export interface IBaseColumn {
	Id: number;
	Key?: string;
}

/**
 * Component used to render standard grid view for action parameters.
 */
@Component({
	selector: 'workflow-main-parameter-grid-view',
	templateUrl: './parameter-grid-view.component.html',
	styleUrls: ['./parameter-grid-view.component.scss']
})
export class ParameterGridViewComponent<Entity extends object, ColumnDef extends IBaseColumn> implements OnInit {

	/**
	 * Load grid and toolbar after input is received.
	 */
	public ngOnInit(): void {
		if(this.editorViewConfig.gridProperties.enableToolbarActions) {
			this.loadToolbar();
		}
		this.loadGrid();
	}

	@Input()
	public editorViewConfig!: IGridView<Entity, ColumnDef>;

	// #region load toolbar content
	private readonly toolbarContent = new MenuListContent();
	private loadToolbar() {
		this.toolbarContent.addItems(this.toolbarItems());
	}

	private toolbarItems(): ConcreteMenuItem<void>[] {
		return [
			{
				caption: { key: 'Add' },
				iconClass: 'tlb-icons ico-rec-new',
				type: ItemType.Item,
				fn: this.addItem,
				disabled: false,
				id: `add-${this.editorViewConfig.label}`,
				sort: 1,
			},
			{
				caption: { key: 'Remove' },
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: this.removeItem,
				disabled: () => {
					return this.selectedItems === undefined || (this.selectedItems && this.selectedItems.length === 0);
				},
				id: `remove-${this.editorViewConfig.label}`,
				sort: 2
			},
		];
	}

	public get toolbarData() {
		return this.toolbarContent.items;
	}

	/**
	 * Add item to grid
	 */
	private addItem = (): void => {

		this.gridItems.push({
			Id: Math.max(...this.gridItems.map((item) => item.Id)) + 1
		} as ColumnDef);
		this.gridItems = [...this.gridItems];
		this.editorViewConfig.gridProperties.itemGetter(this.gridItems);

		this.updateGridView();
	};

	/**
	 * Remove selected item from grid
	 */
	private removeItem = (): void => {
		if (this.selectedItems) {
			//Remove item
			this.selectedItems.forEach((selectedItem) => {
				const selectedItemIndex = this.gridItems.indexOf(selectedItem);
				this.gridItems.splice(selectedItemIndex, 1);
			});
			this.gridItems = [...this.gridItems];

			//return updated item to calling component.
			this.editorViewConfig.gridProperties.itemGetter(this.gridItems);
			this.updateGridView();
		}
	};
	// #endregion

	// #region load grid content
	private loadGrid() {
		//Items are undefined on first load, setting default items
		this.editorViewConfig.gridProperties.gridConfiguration.items = this.gridItems;
		this.gridItems = this.editorViewConfig.gridProperties.itemSetter(this.editorViewConfig.entity);
		this.updateGridView();
	}

	/**
	 * Items in the grid.
	 */
	public gridItems: ColumnDef[] = [];
	private selectedItems!: ColumnDef[] | undefined;

	/**
	 * Event triggered on change of selection in the grid.
	 * @param event
	 */
	public selectionChanged = (event: ColumnDef[] | undefined) => {
		this.selectedItems = event;
	};

	/**
	 * Event triggered on change of selected item's value.
	 * @param event
	 */
	public valueChanged = (event: IFieldValueChangeInfo<ColumnDef>) => {
		if(this.editorViewConfig.gridProperties.gridConfiguration.items) {
			this.editorViewConfig.gridProperties.itemGetter(this.editorViewConfig.gridProperties.gridConfiguration.items);
		}
	};
	// #endregion

	private updateGridView() {
		this.editorViewConfig.gridProperties.gridConfiguration = { ...this.editorViewConfig.gridProperties.gridConfiguration, items: this.gridItems };
	}
}