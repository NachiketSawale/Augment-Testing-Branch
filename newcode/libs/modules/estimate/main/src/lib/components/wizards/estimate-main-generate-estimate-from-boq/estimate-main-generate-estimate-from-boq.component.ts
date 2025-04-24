/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, Input } from '@angular/core';
import { UiCommonModule, GridComponent, IGridConfiguration, MenuListContent, ConcreteMenuItem, ItemType, IMenuItemEventInfo, ColumnDef, FieldType } from '@libs/ui/common';

/**
 * This interface is use for EstimateMainGenerateEstimateFromBoqComponent
 */
interface ISelectBoq {
	Type: string;
	ProjectWicId: string;
	ProjectWicGroupDescription: string;
	RootItemId: string;
	BoqRootItemDescription: string;
	EstHeaderId: string;
	EstimateDescription: string;
	Id?: number;
	Sorting?: number;
	Version?: number;
}

@Component({
	selector: 'estimate-main-generate-estimate-from-boq',
	standalone: true,
	imports: [UiCommonModule, GridComponent],
	templateUrl: './estimate-main-generate-estimate-from-boq.component.html',
	styleUrls: ['./estimate-main-generate-estimate-from-boq.component.css'],
})

/**
 * This class gives a grid component to estimate main generate
 * estimate from reference boq wizard
 */
export class EstimateMainGenerateEstimateFromBoqComponent implements OnInit {
	public gridData: ISelectBoq[] = [];
	public gridConfig: IGridConfiguration<ISelectBoq>;
	private selectedItem: ISelectBoq | null = null;

	public constructor() {
		this.gridConfig = {
			uuid: '63e6ada691ae4bf783778fd00ae36060', // Generated UUID
			columns: this.columns,
			skipPermissionCheck: true,
			items: this.gridData,
		};
	}
	/**
	 * Lifecycle hook that is called after data-bound properties of a directive are initialized.
	 */
	public ngOnInit(): void {
		this.loadToolBar();
	}

	@Input()
	private readonly toolbarContent = new MenuListContent();

	/**
	 * Loads toolbar items into the toolbar content.
	 * @returns void
	 */
	private loadToolBar() {
		this.toolbarContent.addItems(this.toolbarItems());
	}

	/**
	 * Defines and returns the items to be displayed on the toolbar.
	 * @returns An array of ConcreteMenuItem objects.
	 */
	private toolbarItems(): ConcreteMenuItem<void>[] {
		return [
			{
				caption: { key: 'cloud.common.taskBarNewRecord' },
				iconClass: 'tlb-icons ico-rec-new',
				hideItem: false,
				id: 'create',
				sort: 0,
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo<void>) => {
					this.createItem();
				},
				disabled: false,
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'tlb-icons ico-rec-delete',
				hideItem: false,
				id: 'delete',
				sort: 10,
				type: ItemType.Item,
				fn: (info: IMenuItemEventInfo<void>) => {
					this.deleteItem();
				},
				disabled: false,
			},
			{
				caption: { key: 'estimate.main.columnConfigDetails.toolsUp' },
				iconClass: 'tlb-icons ico-grid-row-up',
				hideItem: false,
				id: 'moveUp',
				sort: 10,
				type: ItemType.Item,
				fn: () => {
					this.moveUp();
				},
				disabled: () => !this.selectedItem || this.gridData.indexOf(this.selectedItem) === 0,
			},
			{
				caption: { key: 'estimate.main.columnConfigDetails.toolsDown' },
				iconClass: 'tlb-icons ico-grid-row-down',
				hideItem: false,
				id: 'moveDown',
				sort: 10,
				type: ItemType.Item,
				fn: () => {
					this.moveDown();
				},
				disabled: () => !this.selectedItem || this.gridData.indexOf(this.selectedItem) === this.gridData.length - 1,
			},
		];
	}

	/**
	 * Defines the columns for the grid configuration.
	 */
	private columns: ColumnDef<ISelectBoq>[] = [
		{
			id: 'type',
			model: 'Type',
			label: {
				text: 'estimate.main.type',
			},
			type: FieldType.Description, // lookup
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
		{
			id: 'projectWicCode',
			model: 'ProjectWicId',
			label: {
				text: 'estimate.main.projectWicCode',
			},
			type: FieldType.Description, // dynamic
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			// navigator todo integration of navigator in grid column
		},
		{
			id: 'projectWicCodeDescription',
			model: 'ProjectWicId',
			label: {
				text: 'estimate.main.projectWicCodeDescription',
			},
			type: FieldType.Description, // dynamic
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
		{
			id: 'boqHeaderFk',
			model: 'RootItemId',
			label: {
				text: 'BoQ Code',
			},
			type: FieldType.Description, // lookup
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
		{
			id: 'boqHeaderFkDescription',
			model: 'BoqRootItemDescription',
			label: {
				text: 'estimate.main.boqDescription',
			},
			type: FieldType.Description, // dynamic
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
		{
			id: 'estheaderid',
			model: 'EstHeaderId',
			label: {
				text: 'Estimate Code',
			},
			type: FieldType.Description, // dynamic
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
		{
			id: 'estheaderdescription',
			model: 'EstHeaderId',
			label: {
				text: 'estimate.main.generateEstimateDescription',
			},
			type: FieldType.Description, // dynamic
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
		},
	];

	/**
	 * Getter for the toolbar data items.
	 * @returns The items in the toolbar content.
	 */
	public get toolbarData() {
		return this.toolbarContent.items;
	}

	/**
	 * Handles the event when an item is selected in the grid.
	 * @param item - The selected item.
	 * @returns void
	 */
	public onItemSelected(item: ISelectBoq): void {
		this.selectedItem = item;
	}

	/**
	 * Creates a new item and adds it to the grid data.
	 * @returns void
	 */
	private createItem(): void {
		const id = this.gridData.length + 1;
		const previousType = this.gridData.length > 0 ? +this.gridData[this.gridData.length - 1].Type : 0;
		const item: ISelectBoq = {
			Id: id,
			Type: (previousType + 1).toString(),
			Sorting: id,
			Version: 0,
			ProjectWicId: '',
			ProjectWicGroupDescription: '',
			RootItemId: '',
			BoqRootItemDescription: '',
			EstHeaderId: '',
			EstimateDescription: '',
		};

		this.addItems([item]);
	}

	/**
	 * Adds new items to the grid data and refreshes the grid.
	 * @param items - The items to be added.
	 * @returns void
	 */
	private addItems(items: ISelectBoq[]): void {
		if (!items) {
			this.gridData = [];
			return;
		}

		items.forEach((item, index) => {
			const matchItem = this.gridData.find((existingItem) => existingItem.Id === item.Id);
			if (!matchItem) {
				item.Sorting = index;
				this.gridData.push(item);
			}
		});
		this.refreshGrid();
	}

	/**
	 * Deletes the selected item from the grid data.
	 * @returns void
	 */
	private deleteItem(): void {
		if (this.selectedItem) {
			const index = this.gridData.indexOf(this.selectedItem);
			if (index !== -1) {
				this.gridData.splice(index, 1);
				this.refreshGrid();
			}
		}
	}

	/**
	 * Moves the selected item up in the grid data.
	 * @returns void
	 */
	private moveUp(): void {
		if (this.selectedItem) {
			const currentIndex = this.gridData.indexOf(this.selectedItem);
			if (currentIndex > 0) {
				const newIndex = currentIndex - 1;
				this.moveItem(currentIndex, newIndex);
			}
		}
	}

	/**
	 * Moves the selected item down in the grid data.
	 * @returns void
	 */
	private moveDown(): void {
		if (this.selectedItem) {
			const currentIndex = this.gridData.indexOf(this.selectedItem);
			if (currentIndex < this.gridData.length - 1) {
				const newIndex = currentIndex + 1;
				this.moveItem(currentIndex, newIndex);
			}
		}
	}

	/**
	 * Moves an item in the grid data from one index to another.
	 * @param currentIndex - The current index of the item.
	 * @param newIndex - The new index of the item.
	 * @returns void
	 */
	private moveItem(currentIndex: number, newIndex: number): void {
		const itemToMove = this.gridData[currentIndex];
		this.gridData.splice(currentIndex, 1);
		this.gridData.splice(newIndex, 0, itemToMove);
		this.updateSorting();
		this.refreshGrid();
	}

	/**
	 * Updates the sorting order of the grid data items.
	 * @returns void
	 */
	private updateSorting(): void {
		this.gridData.forEach((item, index) => {
			item.Sorting = index;
		});
	}

	/**
	 * Refreshes the grid data to trigger change detection.
	 * @returns void
	 */
	private refreshGrid(): void {
		this.gridConfig = { ...this.gridConfig, items: [...this.gridData] }; // Trigger change detection
	}
}
