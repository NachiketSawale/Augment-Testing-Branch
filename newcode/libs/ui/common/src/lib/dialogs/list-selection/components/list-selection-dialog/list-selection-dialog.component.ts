/*
 * Copyright(c) RIB Software GmbH
 */
import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { UiCommonListSelectionDialogUtilitiesService } from '../../services/list-selection-dialog-utilities.service';

import { Translatable } from '@libs/platform/common';
import { IGridApi, IGridConfiguration, IGridTreeConfiguration } from '../../../../grid';
import { IMenuItemsList } from '../../../../model/menu-list/interface';
import { StandardDialogButtonId, getCustomDialogDataToken } from '../../../base';
import { ItemType } from '../../../../model/menu-list/enum/menulist-item-type.enum';
import { IListSelectionDialogUtilityData } from '../../model/list-selection-dialog-utility-data.interface';
import { getArrayAsSetObject, getListSelectionDialogDataToken, IAvailableItemsInfo } from '../../model/list-selection-dialog-data.interface';
import { IFieldValueChangeInfo } from '../../../../model/fields';

/**
 * Component renders the list selection dialog body and implements the basic functionality.
 */
@Component({
	selector: 'ui-common-list-selection-dialog',
	templateUrl: './list-selection-dialog.component.html',
	styleUrl: './list-selection-dialog.component.scss',
})
export class ListSelectionDialogComponent<T extends object> implements OnInit {
	/**
	 * A reference to the dialog box supplied to calling code.
	 */
	public readonly dialogInfo;

	/**
	 * Menulist data.
	 */
	public selectedItemsTools!: IMenuItemsList<void>;

	/**
	 * Dialog body specific data.
	 */
	private readonly dialogData = inject(getListSelectionDialogDataToken<T>());

	/**
	 * Configuration parameters of Available grid.
	 */
	public availableGridConfig!: IGridConfiguration<T>;

	/**
	 * Configuration parameters of Selected grid.
	 */
	public selectedGridConfig!: IGridConfiguration<T>;

	/**
	 * Utility service to handle toolbar operations.
	 */
	private readonly listSelectionDialogUtilitiesService = inject(UiCommonListSelectionDialogUtilitiesService);

	/**
	 * Available grid element reference.
	 */
	@ViewChild('availableGridElement') private readonly availableGridElement!: IGridApi<T>;

	/**
	 * Selected grid element reference.
	 */
	@ViewChild('selectedGridElement') private readonly selectedGridElement!: IGridApi<T>;

	/**
	 * Available grid UUID.
	 */
	private readonly availableGridUuid = '3d5c91da4d144a4ab30777df6ed0806e';

	/**
	 * Selected grid UUID.
	 */
	private readonly selectedGridUuid = 'dfdd06a581624d11ab1e6aa1103e76e2';

	/**
	 * Dialog reference data.
	 */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<T, ListSelectionDialogComponent<T>>());

	/**
	 * Default grid properties.
	 */
	private readonly defaultGridProperties = {
		showSearchPanel: true,
		showColumnSearchPanel: false,
	};

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: ListSelectionDialogComponent<T>) {
			return {
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				},
				allItems: owner.dialogData.allItems,
			};
		})(this);
	}

	public ngOnInit() {
		this.updateGridData();
		if (!this.dialogData.sortItems) {
			this.initToolbar();
		}
	}

	/**
	 * Title for available grid.
	 */
	public get availableTitle() {
		return this.dialogData.availableTitle as Translatable;
	}

	/**
	 * Title for selected grid.
	 */
	public get selectedTitle() {
		return this.dialogData.selectedTitle as Translatable;
	}

	/**
	 * Returns selected grid data from selected list.
	 *
	 * @returns { T[] } Selected grid items from selected list.
	 */
	private getSelectedGridData(): T[] {
		return this.selectedGridElement ? this.selectedGridElement.selection : [];
	}

	/**
	 * Returns selected grid data from available list.
	 *
	 * @returns { T[] } Selected grid items from available list.
	 */
	private getAvailableGridData(): T[] {
		return this.availableGridElement ? this.availableGridElement.selection : [];
	}

	/**
	 * Returns if the icon is enable or disable.
	 *
	 * @returns { boolean } Is icon disabled
	 */
	public isAvailableItemSelected(): boolean {
		const selected = this.getAvailableGridData();
		const availableItems = selected.filter((item) => {
			return this.dialogData.isSelectable && this.dialogData.isSelectable(item, this.dialogInfo);
		});

		return availableItems.length > 0;
	}

	/**
	 * Returns if the icon is enable or disable.
	 *
	 * @returns { boolean } Is icon disabled
	 */
	public isSelectedItemSelected(): boolean {
		const selected = this.getSelectedGridData();
		return selected.length > 0;
	}

	/**
	 * Returns tree configuration for available item list.
	 *
	 * @returns Tree configuration for available item list.
	 */
	private getTreeConfig(availableItems: IAvailableItemsInfo<T>): IGridTreeConfiguration<T> {
		return (function getTreeConfig(owner: ListSelectionDialogComponent<T>) {
			return {
				parent: (item) => {
					return availableItems.parentOf(item) as T | null;
				},
				children(entity) {
					const prop = owner.dialogData.idProperty;
					return (
						owner.availableGridConfig.items?.reduce((result: T[], item: T) => {
							if (!!this.parent(item) && entity[prop] === this.parent(item)?.[prop]) {
								result.push(item);
							}
							return result;
						}, []) || []
					);
				},
			};
		})(this);
	}

	/**
	 * Updates the data for available grid.
	 */
	private updateAvailableGrid(): void {
		const availableItems = this.dialogData.getAvailableItems(this.dialogInfo);
		let config = { ...this.dialogData.availableGridConfig, items: availableItems.items, uuid: this.availableGridUuid, ...this.defaultGridProperties };

		if (this.dialogData.availableGridConfig.treeConfiguration) {
			config = { ...config, treeConfiguration: this.getTreeConfig(availableItems) };
		}

		this.availableGridConfig = config;
	}

	/**
	 * Updates the data for selected grid.
	 */
	private updateSelectedGrid(): void {
		const selItems = this.dialogData.getSelectedItems();
		this.selectedGridConfig = { ...this.dialogData.selectedGridConfig, items: selItems, uuid: this.selectedGridUuid, ...this.defaultGridProperties };
	}

	/**
	 * Update grid data.
	 */
	private updateGridData(): void {
		this.updateAvailableGrid();
		this.updateSelectedGrid();
	}

	/**
	 * Gets called when grid field values gets changed.
	 */
	public onValueChanged(data: IFieldValueChangeInfo<T>){
		const item = this.dialogData.value.find((dlgItem)=>{
			return data.entity[this.dialogData.idProperty] === dlgItem[this.dialogData.idProperty];
		});

		if(item){
			Object.assign(item, data.entity);
		}
	}

	/**
	 * Method selects the items from selected list.
	 *
	 * @param { T[] } items Items to be selected from selected list.
	 */
	private setSelectedSelectedItemIndexes(items: T[]): void {
		setTimeout(() => {
			this.selectedGridElement.selection = items;
		}, 0);
	}

	/**
	 * Function adds the items to selected list.
	 *
	 * @param { boolean } all Parameter to indicate if all items are to be added.
	 */
	public addItems(all: boolean): void {
		const selItems = this.dialogData.value;
		const visibleAvailableItems = this.availableGridConfig.items ?? [];
		const visibleAvailableItemIds = getArrayAsSetObject(visibleAvailableItems, this.dialogData.getItemId.bind(this.dialogData));

		let insertionIndex = selItems.length;
		const selected = this.getSelectedGridData();

		if (selected && selected.length == 1) {
			insertionIndex =
				selItems.findIndex((item) => {
					return item[this.dialogData.temporarySelectedIdProperty] === selected[0][this.dialogData.temporarySelectedIdProperty];
				}) + 1;
		}

		const movedItemIds: T[] = [];

		if (all) {
			const selItemIds = getArrayAsSetObject(selItems, this.dialogData.getItemId.bind(this.dialogData));
			this.dialogData.getAllSelectableItems(this.dialogInfo).forEach((avItem) => {
				const itemId = this.dialogData.getItemId(avItem);
				if (visibleAvailableItemIds[itemId as string] && !selItemIds[itemId as string]) {
					const newSelItem = this.dialogData.createSelectedItem(itemId);
					selItems.splice(insertionIndex++, 0, newSelItem);
					movedItemIds.push(avItem);
				}
			});
		} else {
			const selectedAvailable = this.getAvailableGridData();

			selectedAvailable.forEach((avItem) => {
				const itemId = this.dialogData.getItemId(avItem);
				if (visibleAvailableItemIds[itemId as string]) {
					const origItem = this.dialogData.findAvailableItemById(itemId);
					if (origItem && this.dialogData.isSelectable && this.dialogData.isSelectable(origItem, this.dialogInfo)) {
						const newSelItem = this.dialogData.createSelectedItem(itemId);
						selItems.splice(insertionIndex++, 0, newSelItem);
						movedItemIds.push(origItem);
					}
				}
			});
		}

		this.updateGridData();
		this.setSelectedSelectedItemIndexes(movedItemIds);
	}

	/**
	 * Function adds the items to available list.
	 *
	 * @param { boolean } all Parameter to indicate if all items are to be removed.
	 */
	public removeItems(all: boolean): void {
		const visibleSelectedItems = this.selectedGridConfig.items ?? [];
		const visibleSelectedItemIds = getArrayAsSetObject(visibleSelectedItems, this.dialogData.getSelectedItemId.bind(this.dialogData));

		const movedItemIds: T[] = [];
		const selItems = this.dialogData.value;

		if (all) {
			for (let i = selItems.length - 1; i >= 0; i--) {
				const itemId = this.dialogData.getSelectedItemId(selItems[i]);
				if (visibleSelectedItemIds[itemId as string]) {
					movedItemIds.push(selItems[i]);
					selItems.splice(i, 1);
				}
			}
		} else {
			const selectedSelected = this.getSelectedGridData();

			selectedSelected.forEach((selItem) => {
				const itemId = this.dialogData.getSelectedItemId(selItem);
				if (visibleSelectedItemIds[itemId as string]) {
					const index = selItems.findIndex((item) => {
						return this.dialogData.getSelectedItemId(item) === itemId;
					});

					if (index >= 0) {
						movedItemIds.push(selItem);
						selItems.splice(index, 1);
					}
				}
			});
		}

		this.updateGridData();
		setTimeout(() => {
			this.availableGridElement.selection = movedItemIds;
			this.setSelectedSelectedItemIndexes([]);
		}, 0);
	}

	/**
	 * Function moves the items up and down the list.
	 *
	 * @param { T[] } array Items list.
	 * @param { number } fromIndex Current position of the item to be shifted.
	 * @param { number } toIndex Position where source item is to be shifted.
	 */
	private move<T>(array: T[], fromIndex: number, toIndex: number): void {
		const item = array.splice(fromIndex, 1)[0];
		array.splice(toIndex, 0, item);
	}

	/**
	 * Returns data used to move entity item up/down.
	 *
	 * @returns { IListSelectionDialogUtilityData }  Toolbar data used to move entity item up/down.
	 */
	private generateSelectedItemMovementInfo(): IListSelectionDialogUtilityData {
		return {
			totalCount: this.dialogData.value.length,
			indexesToMove: this.getSelectedGridData().map((selItem) => {
				const selItemId = this.dialogData.getSelectedItemId(selItem);
				return this.dialogData.value.findIndex((item) => {
					return selItemId === this.dialogData.getSelectedItemId(item);
				});
			}),
			moveItemFunc: (fromIndex: number, toIndex: number) => {
				this.move(this.dialogData.value, fromIndex, toIndex);
			},
			delta: 0,
		};
	}

	/**
	 * Returns if toolbar icon is enable or disable.
	 *
	 * @returns { boolean } Is toolbar icon enable or disable.
	 */
	private isSelectedGridFiltered(): boolean {
		return this.selectedGridConfig.items?.length !== this.dialogData.value.length;
	}

	/**
	 * Function initializes toolbar.
	 */
	private initToolbar(): void {
		this.selectedItemsTools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 'moveUp',
					sort: 10,
					caption: 'cloud.common.toolbarMoveUp',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-up',
					fn: () => {
						const selectedData = cloneDeep(this.getSelectedGridData());
						const info = { ...this.generateSelectedItemMovementInfo(), ...{ delta: -1 } };
						this.listSelectionDialogUtilitiesService.moveItems(info);
						this.updateSelectedGrid();
						this.setSelectedSelectedItemIndexes(selectedData);
					},
					disabled: () => {
						const info = { ...this.generateSelectedItemMovementInfo(), ...{ delta: -1 } };
						return !this.listSelectionDialogUtilitiesService.canMoveItems(info) || this.isSelectedGridFiltered();
					},
				},
				{
					id: 'moveDown',
					sort: 10,
					caption: 'cloud.common.toolbarMoveDown',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-down',
					fn: () => {
						const selectedData = cloneDeep(this.getSelectedGridData());
						const info = { ...this.generateSelectedItemMovementInfo(), ...{ delta: 1 } };
						this.listSelectionDialogUtilitiesService.moveItems(info);
						this.updateSelectedGrid();
						this.setSelectedSelectedItemIndexes(selectedData);
					},
					disabled: () => {
						const info = { ...this.generateSelectedItemMovementInfo(), ...{ delta: 1 } };
						return !this.listSelectionDialogUtilitiesService.canMoveItems(info) || this.isSelectedGridFiltered();
					},
				},
				{
					id: 'moveTop',
					sort: 0,
					caption: 'cloud.common.toolbarMoveTop',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-start',
					fn: () => {
						const selectedData = cloneDeep(this.getSelectedGridData());
						this.listSelectionDialogUtilitiesService.moveItemsToBeginning(this.generateSelectedItemMovementInfo());
						this.updateSelectedGrid();
						this.setSelectedSelectedItemIndexes(selectedData);
					},
					disabled: () => {
						return !this.listSelectionDialogUtilitiesService.canMoveItemsToBeginning(this.generateSelectedItemMovementInfo()) || this.isSelectedGridFiltered();
					},
				},
				{
					id: 'moveBottom',
					sort: 10,
					caption: 'cloud.common.toolbarMoveBottom',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-end',
					fn: () => {
						const selectedData = cloneDeep(this.getSelectedGridData());
						this.listSelectionDialogUtilitiesService.moveItemsToEnd(this.generateSelectedItemMovementInfo());
						this.updateSelectedGrid();
						this.setSelectedSelectedItemIndexes(selectedData);
					},
					disabled: () => {
						return !this.listSelectionDialogUtilitiesService.canMoveItemsToEnd(this.generateSelectedItemMovementInfo()) || this.isSelectedGridFiltered();
					},
				},
			],
		};
	}
}
