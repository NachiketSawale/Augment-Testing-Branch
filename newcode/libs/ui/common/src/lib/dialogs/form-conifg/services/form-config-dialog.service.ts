/*
 * Copyright(c) RIB Software GmbH
 */
import { cloneDeep, find, sortBy } from 'lodash';
import { inject, Injectable } from '@angular/core';

import { ColumnDef, GridItemId, IGridTreeConfiguration } from '../../../grid';
import { IClosingDialogButtonEventInfo, IEditorDialogResult, StandardDialogButtonId } from '../../base';
import { PropertyType } from '@libs/platform/common';
import { IReadOnlyEntityRuntimeDataRegistry } from '@libs/platform/data-access';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';
import { IFormConfigDialogState } from '../model/form-config-dialog-state.interface';
import {
	createLookup,
	FieldType,
	IFieldValueChangeInfo
} from '../../../model/fields';
import { IMenuItemEventInfo, IMenuItemsList } from '../../../model/menu-list/interface';
import { IFormConfigDialogOptions } from '../model/form-config-dialog-options.interface';
import { IFormConfigDialogGridData } from '../model/form-config-dialog-grid-data.interface';
import {
	IGridDialog,
	IGridDialogOptions,
	IGridDialogState,
	UiCommonGridDialogService
} from '../../grid';
import {
	IFormConfigDialogColumnsData,
	IFormConfigDialogData
} from '../model/form-config-dialog-data.interface';
import { UiCommonGridConfigUserLabelLookupService } from '../../grid-config/services/grid-config-user-label-lookup.service';
import { IFormConfigDialogHierarchialGridData } from '../model/form-config-dialog-hierarchial-grid-data.interface';
import { FormConfigDialogEntityShiftType } from '../model/form-config-dialog-entity-shift-type.enum';


type AcceptBooleans<T> = {
	[K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

/**
 * This service displays form config modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonFormConfigDialogService {
	/**
	 * This service displays grid modal dialog.
	 */
	private readonly gridDialogSvc = inject(UiCommonGridDialogService);

	/**
	 * Id for the rootItem
	 */
	private readonly rootItemId = -1;

	/**
	 * Hierarchial grid data for shifting operations.
	 */
	private hierarchialData!:IFormConfigDialogHierarchialGridData[];

	/**
	 * Displays a custom dialog box.
	 *
	 * @typeParam T The value type to edit in the dialog.
	 *
	 * @param options An object that contains configuration options for the dialog box.
	 *
	 * @returns Result of the dialog.
	 */
	public show<T extends IFormConfigDialogData>(options: IFormConfigDialogOptions<T>): Promise<IEditorDialogResult<IFormConfigDialogState<T>>> | undefined {
		const selectedColumns = this.getPreDefinedColumns<T>();

		if (options.additionalSelectedGridColumns) {
			selectedColumns.push(...options.additionalSelectedGridColumns);
		}

		const items = this.getItems(options);


		const selectedItems = options.selectedItem ? [options.selectedItem] : [];

		const gridDialogData: IGridDialogOptions<IFormConfigDialogGridData<T>> = {
			...{
				width: '70%',
				windowClass: 'grid-dialog',
				title: 'cloud.desktop.formConfigDialogSubTitle',
				gridConfig: {
					uuid: 'dfdd06a581624d11ab1e6aa1103e76e2',
					columns: selectedColumns as ColumnDef<IFormConfigDialogGridData<T>>[],
					idProperty: 'id',
					treeConfiguration: this.getTreeConfig(items),
					skipPermissionCheck: true,
					//TODO: Grid giving errors for checkbox.
					//TODO: Uncomment when issue resolved
					entityRuntimeData: this.getEntityRuntimeData(),
				},
				tools: this.getToolItems(),
				items: items,
				selectedItems: selectedItems,
				onCellValueChanged: (data, info) => {
					//TODO: Grid giving errors for boolean value
					//TODO: Uncomment when DEV-30362 resolved.
					this.setPropertyValue(data, info);
				},
			},
			...(options as unknown as IGridDialogOptions<IFormConfigDialogGridData<T>>),
		};

		this.addRestoreButton(gridDialogData, options);

		return this.gridDialogSvc.show(gridDialogData)?.then((result) => {
			if(result.closingButtonId === StandardDialogButtonId.Ok){
				return this.getFinalSettings(result);
			}

			return {
				closingButtonId: result.closingButtonId
			};
		});
	}

	/**
	 * Adds data restore button to dialog.
	 *
	 * @param dialogData Dialog data
	 */
	private addRestoreButton<T extends IFormConfigDialogData>(
		dialogData:IGridDialogOptions<IFormConfigDialogGridData<T>>,
		options:IFormConfigDialogOptions<T>
	): void{
		if(!dialogData.customButtons){
			dialogData.customButtons = [];
		}

		dialogData.customButtons.push({
			id: 'restore',
			caption:{
				key: 'cloud.desktop.formConfigRestoreBnt',
				text: 'Restore'
			},
			fn: (event: MouseEvent, info: IClosingDialogButtonEventInfo<IGridDialog<IFormConfigDialogGridData<T>>,void>)=>{
				const items = this.getItems(options);
				info.dialog.items.length = 0;
				info.dialog.items.push(...items);
				info.dialog.gridRef.selection.length = 0;
				info.dialog.selectedItems.length = 0;
				info.dialog.gridRef.refresh();
			}

		});
	}

	/**
	 * Returns tree configuration for dialog.
	 *
	 * @param items Dialog data.
	 * @returns Tree configuration.
	 */
	private getTreeConfig<T extends IFormConfigDialogData>(items:IFormConfigDialogGridData<T>[]) : IGridTreeConfiguration<IFormConfigDialogGridData<T>>{
		return  {
			children: (entity:IFormConfigDialogGridData<T>) => {
				return (
					items?.reduce((result: IFormConfigDialogGridData<T>[], item) => {
						if (entity.id === item.parent) {
							result.push(item);
						}
						return result;
					}, []) || []
				);
			},
			parent: (entity:IFormConfigDialogGridData<T>) => {
				if (entity.parent) {
					return items?.find((item) => item.id === entity.parent) || null;
				}
				return null;
			},
		};
	}

	/**
	 * Returns the dialog final result values.
	 *
	 * @param result Dialog final values
	 * @returns Final result
	 */
	private getFinalSettings<T extends IFormConfigDialogData>(result: IEditorDialogResult<IGridDialogState<IFormConfigDialogGridData<T>>>): IEditorDialogResult<IFormConfigDialogState<T>> {
		let groups: Omit<IFormConfigDialogData, 'rowId'>[] = [];
		let rows: T[] = [];

		if (result.value) {
			groups = result.value.items.filter((item) => item.parent === this.rootItemId);
			rows = result.value.items.filter((item) => item.parent && item.parent !== this.rootItemId);
		}

		const value: IFormConfigDialogState<T> = {
			groups: groups,
			rows: rows,
		};

		if(result.value && result.value.selectedItems.length){
			value.selectedItem = result.value.selectedItems.slice(-1)[0];
		}

		return {
			value: value,
			closingButtonId: result.closingButtonId,
		};
	}

	/**
	 * Returns runtime data object.
	 *
	 * @returns Dialog run time data
	 */
	private getEntityRuntimeData<T extends IFormConfigDialogData>(): IReadOnlyEntityRuntimeDataRegistry<T> {
		return {
			getValidationErrors: (entity: T) => [],
			getInvalidEntities: () => [],
			hasValidationErrors: () => false,
			isEntityReadOnly: (entity: T) => false,
			getEntityReadOnlyFields: (entity: T) => {
				const readonly = entity.readonly ?? [];
				const element = readonly.find((ite) => {
					return ite.field === 'userLabelName';
				});
				if (entity.labelCode) {
					if (!element) {
						readonly.push({
							field: 'userLabelName',
							readOnly: true,
						});
					} else {
						element.readOnly = true;
					}
				} else {
					if (element && entity.groupId) {
						element.readOnly = false;
					}
				}

				return readonly;
			},
			getEntityReadonlyRuntimeData: (entity: T) => null,
		};
	}

	/**
	 * Method returns the fixed columns.
	 *
	 * @typeParam T The value type to edit in the dialog.
	 *
	 * @returns Column definitions.
	 */
	private getPreDefinedColumns<T extends IFormConfigDialogColumnsData>(): ColumnDef<T>[] {
		return [
			{
				id: 'label',
				model: 'label',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigLabelName',
					text: 'Label name',
				},
				type: FieldType.Description,
				width: 210,
				visible: true,
				readonly: true,
			},
			{
				id: 'userLabelCode',
				model: 'labelCode',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigLabelCode',
					text: 'Label Code',
				},
				type: FieldType.Lookup,
				width: 180,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: UiCommonGridConfigUserLabelLookupService,
				}),
			},
			{
				id: 'customerLabel',
				model: 'userLabelName',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigCustomerLabelName',
					text: 'User label name',
				},
				type: FieldType.Description,
				width: 180,
				visible: true,
			},
			{
				id: 'visible',
				model: 'visible',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigVisibility',
					text: 'Visible',
				},
				type: FieldType.Boolean,
				width: 70,
				visible: true,
			},
			{
				id: 'enterStop',
				model: 'enterStop',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigAllowEnterNavigation',
					text: 'Enter Stop',
				},
				type: FieldType.Boolean,
				width: 70,
				visible: true,
			},
		];
	}

	/**
	 * Returns toolbar menu list items.
	 *
	 * @returns Menu list.
	 */
	private getToolItems<T extends IFormConfigDialogData>(): IMenuItemsList<IGridDialog<IFormConfigDialogGridData<T>>> {
		return {
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
					fn: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						this.setHierarchialGridData(info.context.items);
						const selected = info.context.selectedItems;
						const selectedItem = this.getSelectedItem(selected[selected.length - 1], this.hierarchialData);
						if (selectedItem) {
							this.moveUp(FormConfigDialogEntityShiftType.Up, selectedItem);
							this.refreshGrid(info.context, selectedItem);
						}
					},
					disabled: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						return !info.context.selectedItems.length;
					},
				},
				{
					id: 'moveDown',
					sort: 10,
					caption: 'cloud.common.toolbarMoveDown',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-down',
					fn: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						this.setHierarchialGridData(info.context.items);
						const selected = info.context.selectedItems;
						const selectedItem = this.getSelectedItem(selected[selected.length - 1], this.hierarchialData);
						if (selectedItem) {
							this.moveDown(FormConfigDialogEntityShiftType.Down, selectedItem);
							this.refreshGrid(info.context, selectedItem);
						}
					},
					disabled: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						return !info.context.selectedItems.length;
					},
				},
				{
					id: 'moveTop',
					sort: 0,
					caption: 'cloud.common.toolbarMoveTop',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-start',
					fn: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						this.setHierarchialGridData(info.context.items);
						const selected = info.context.selectedItems;
						const selectedItem = this.getSelectedItem(selected[selected.length - 1], this.hierarchialData);
						if (selectedItem) {
							this.moveUp(FormConfigDialogEntityShiftType.Top, selectedItem);
							this.refreshGrid(info.context, selectedItem);
						}
					},
					disabled: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						return !info.context.selectedItems.length;
					},
				},
				{
					id: 'moveBottom',
					sort: 10,
					caption: 'cloud.common.toolbarMoveBottom',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-grid-row-end',
					fn: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						this.setHierarchialGridData(info.context.items);
						const selected = info.context.selectedItems;
						const selectedItem = this.getSelectedItem(selected[selected.length - 1], this.hierarchialData);
						if (selectedItem) {
							this.moveDown(FormConfigDialogEntityShiftType.Bottom, selectedItem);
							this.refreshGrid(info.context, selectedItem);
						}
					},
					disabled: (info: IMenuItemEventInfo<IGridDialog<IFormConfigDialogGridData<T>>>) => {
						return !info.context.selectedItems.length;
					},
				},
			],
		};
	}

	/**
	 * Returns grid items to render.
	 *
	 * @param options Dialog options.
	 * @returns Grid items.
	 */
	private getItems<T extends IFormConfigDialogData>(options: IFormConfigDialogOptions<T>): IFormConfigDialogGridData<T>[] {
		const gridItems: IFormConfigDialogGridData<T>[] = [];

		options.groups.forEach((group) => {
			const groupItem = {
				...cloneDeep(group),
				id: group.groupId,
				image: 'control-icons ico-accordion-grp',
				parent: this.rootItemId,
			} as IFormConfigDialogGridData<T>;

			gridItems.push(groupItem);

			options.rows.forEach((row) => {
				if (row.groupId === group.groupId) {
					const rowItem = {
						...cloneDeep(row),
						id: row.rowId,
						parent: row.groupId,
						image: 'control-icons ico-accordion-pos',
					};
					gridItems.push(rowItem);
				}
			});

			this.setParentProperty(groupItem, gridItems.filter((item) => item.parent === groupItem.id), 'visible');
			this.setParentProperty(groupItem, gridItems.filter((item) => item.parent === groupItem.id), 'enterStop');
		});

		const rootItem = {
			id: this.rootItemId,
			image: 'control-icons ico-accordion-root',
			labelCode: '',
			label: '',
			visible: false,
			enterStop: false,
			readonly: [
				{
					field: 'labelCode',
					readOnly: true,
				},
				{
					field: 'userLabelName',
					readOnly: true,
				},
			],
		} as IFormConfigDialogGridData<T>;

		gridItems.push(rootItem);

		this.setParentProperty(rootItem, gridItems.filter((item) => item.parent === rootItem.id), 'visible');
		this.setParentProperty(rootItem, gridItems.filter((item) => item.parent === rootItem.id), 'enterStop');

		return gridItems;
	}

	/**
	 * Sets the group property according to the child items.
	 *
	 * @param groupItem Group for which property is to be set.
	 * @param childItems Child items for group.
	 * @param prop Item property to be changed
	 */
	private setParentProperty<T extends IFormConfigDialogData>(groupItem: IFormConfigDialogGridData<T>, childItems: IFormConfigDialogGridData<T>[], prop: AcceptBooleans<IFormConfigDialogData>): void {
		if (!prop) {
			return;
		}

		groupItem[prop] = false;

		const childPropTrue = childItems.filter((item) => {
			return !!item[prop];
		});

		const childPropNull = childItems.filter((item) => {
			return !item[prop];
		});

		if (childPropTrue && childPropTrue.length === childItems.length) {
			groupItem[prop] = true;
		}

		if (childPropTrue.length === 0 && childPropNull.length === 0) {
			groupItem[prop] = false;
		}
	}

	/**
	 * Sets grid data.
	 *
	 * @param data Grid context
	 * @param info Field whose value is changed.
	 */
	private setPropertyValue<T extends IFormConfigDialogData>(data: IGridDialog<IFormConfigDialogGridData<T>>, info: IFieldValueChangeInfo<IFormConfigDialogGridData<T>, PropertyType>): void {
		const isGroup = info.entity.parent === this.rootItemId;
		const isRoot = !info.entity.parent;
		const prop = info.field.id;

		if (prop === 'visible' || prop === 'enterStop') {
			if (isRoot) {
				data.items.forEach((item) => {
					if (!item.parent) {
						item[prop] = info.entity[prop];
					}
				});
			} else if (isGroup) {
				data.items.forEach((item) => {
					if (item.parent === info.entity.id) {
						item[prop] = info.entity[prop];
					}
				});

				const rootEle = data.items.filter((ite) => !ite.parent);
				this.setParentProperty(rootEle[0], data.items.filter((item) => item.parent === rootEle[0].id), prop);

				data.gridRef.refresh();
			} else {
				const rootEle = data.items.filter((ite) => !ite.parent);
				const group = data.items.filter((ite) => ite.id === info.entity.parent);

				this.setParentProperty(group[0], data.items.filter((item) => item.parent === group[0].id), prop);
				this.setParentProperty(rootEle[0], data.items.filter((item) => item.parent === rootEle[0].id), prop);

				data.gridRef.refresh();
			}
		}
	}

	/**
	 * Returns group for the row.
	 *
	 * @param row Selected item.
	 * @returns Group in which row is present.
	 */
	private getGroupByRow(row: IFormConfigDialogHierarchialGridData): IFormConfigDialogHierarchialGridData | undefined {
		return find(this.hierarchialData[0].childItems, { groupId: row.groupId });
	}

	/**
	 * Checks if row selected is the first one in the group.
	 *
	 * @param row Selected item.
	 * @param group Group in which item is present.
	 * @returns Is row the first one in the group.
	 */
	private isFirstRowInGroup(row: IFormConfigDialogHierarchialGridData, group: IFormConfigDialogHierarchialGridData): boolean {
		return group.childItems.indexOf(row) === 0;
	}

	/**
	 * Checks if the group selected is the first group.
	 *
	 * @param group Selected item
	 * @returns Is group the first one.
	 */
	private isFirstGroup(group: IFormConfigDialogHierarchialGridData): boolean {
		return this.hierarchialData[0].childItems.indexOf(group) === 0;
	}

	/**
	 * Moves row to the previous group.
	 *
	 * @param row Selected item.
	 * @param group Group in which item is present.
	 */
	private moveRowToPreviousGroup(row: IFormConfigDialogHierarchialGridData, group: IFormConfigDialogHierarchialGridData): void {
		const prevGroup = this.getPreviousGroup(group);
		row.groupId = prevGroup.groupId;
		row.parent = prevGroup.groupId;
		this.removeRowFromGroup(group, row);
		prevGroup.childItems.push(row);
	}

	/**
	 * Returns the previous group for the group provided.
	 *
	 * @param group Selected item.
	 * @returns Previous group.
	 */
	private getPreviousGroup(group: IFormConfigDialogHierarchialGridData): IFormConfigDialogHierarchialGridData {
		const groupIndex = this.hierarchialData[0].childItems.indexOf(group);
		return this.hierarchialData[0].childItems[groupIndex - 1];
	}

	/**
	 * Removes row from the group.
	 *
	 * @param group Group in which item is present.
	 * @param row Item to be removed.
	 */
	private removeRowFromGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		const rowIndex = group.childItems.indexOf(row);
		group.childItems.splice(rowIndex, 1);
	}

	/**
	 * Shifts row to top in current group.
	 *
	 * @param group Group in which item is present.
	 * @param row Item to be shifted.
	 */
	private moveRowToTopPositionInGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		group.childItems = sortBy(group.childItems, function (item) {
			return item.id === row.id ? 0 : 1;
		});
	}

	/**
	 * Shifts row upwards in current group.
	 *
	 * @param group Group in which item is present.
	 * @param row Item to be shifted.
	 */
	private moveRowUpInGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		const array = group.childItems;
		const rowIndex = array.indexOf(row);
		const prevRow = group.childItems[rowIndex - 1];
		group.childItems[rowIndex - 1] = row;
		group.childItems[rowIndex] = prevRow;
	}

	/**
	 * Shifts row upwards.
	 *
	 * @param row Item to be shifted.
	 * @param type Shift direction(up/down/top/bottom).
	 */
	private moveUpRow(row: IFormConfigDialogHierarchialGridData, type: FormConfigDialogEntityShiftType): void {
		const group = this.getGroupByRow(row);

		if (!group) {
			return;
		}

		if (this.isFirstRowInGroup(row, group) && this.isFirstGroup(group)) {
			return;
		}

		if (this.isFirstRowInGroup(row, group) && !this.isFirstGroup(group)) {
			this.moveRowToPreviousGroup(row, group);
		} else if (type === FormConfigDialogEntityShiftType.Top) {
			this.moveRowToTopPositionInGroup(group, row);
		} else {
			this.moveRowUpInGroup(group, row);
		}
	}

	/**
	 * Shifts group upwards.
	 *
	 * @param group Item to be shifted.
	 * @param type Shift direction(up/down/top/bottom).
	 */
	private moveUpGroup(group: IFormConfigDialogHierarchialGridData, type: FormConfigDialogEntityShiftType): void {
		if (this.isFirstGroup(group)) {
			return;
		}

		if (type === FormConfigDialogEntityShiftType.Top) {
			this.hierarchialData[0].childItems = sortBy(this.hierarchialData[0].childItems, function (item) {
				return item.id === group.id ? 0 : 1;
			});
		} else {
			const groupIndex = this.hierarchialData[0].childItems.indexOf(group);
			const prevGroupIndex = groupIndex - 1;

			const prevGroup = this.hierarchialData[0].childItems[prevGroupIndex];
			this.hierarchialData[0].childItems[prevGroupIndex] = group;
			this.hierarchialData[0].childItems[groupIndex] = prevGroup;
		}
	}

	/**
	 * Shifts item up.
	 *
	 * @param type Shift direction(up/down/top/bottom).
	 * @param selectedItem Item to be shifted.
	 */
	private moveUp(type: FormConfigDialogEntityShiftType, selectedItem: IFormConfigDialogHierarchialGridData): void {
		if (!selectedItem.parent) {
			return;
		}

		if (selectedItem.parent === this.rootItemId) {
			this.moveUpGroup(selectedItem, type);
		} else {
			this.moveUpRow(selectedItem, type);
		}
	}

	/**
	 * Checks if the selected group is the last one in the group.
	 *
	 * @param row Selected item.
	 * @param group Group in which selected item is present.
	 * @returns Is row last in group.
	 */
	private isLastRowInGroup(row: IFormConfigDialogHierarchialGridData, group: IFormConfigDialogHierarchialGridData): boolean {
		return group.childItems.indexOf(row) === group.childItems.length - 1;
	}

	/**
	 * Checks if the selected group is the last one.
	 *
	 * @param group Selected item.
	 * @returns Is group last one.
	 */
	private isLastGroup(group: IFormConfigDialogHierarchialGridData): boolean {
		return this.hierarchialData[0].childItems.indexOf(group) === this.hierarchialData[0].childItems.length - 1;
	}

	/**
	 * Returns next group to the provided one.
	 *
	 * @param group Group
	 * @returns Next group.
	 */
	private getNextGroup(group: IFormConfigDialogHierarchialGridData): IFormConfigDialogHierarchialGridData {
		const groupIndex = this.hierarchialData[0].childItems.indexOf(group);
		return this.hierarchialData[0].childItems[groupIndex + 1];
	}

	/**
	 * Moves row to next group.
	 *
	 * @param group Group in which row belongs.
	 * @param row Item to be shifted.
	 */
	private moveRowToNextGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		const nextGroup = this.getNextGroup(group);
		row.groupId = nextGroup.groupId;
		row.parent = nextGroup.groupId;
		this.removeRowFromGroup(group, row);
		nextGroup.childItems.splice(0, 0, row);
	}

	/**
	 * Moves row to last position in group.
	 *
	 * @param group Group in which row belongs.
	 * @param row Item to be shifted.
	 */
	private moveRowToBottomInGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		group.childItems = sortBy(group.childItems, function (item) {
			return item.id === row.id ? 1 : 0;
		});
	}

	/**
	 * When excute movedown and currentrow is not last row ,movedown to next row in current group.
	 *
	 * @param group Group in which row belongs.
	 * @param row Item to be shifted.
	 */
	private moveRowDownInGroup(group: IFormConfigDialogHierarchialGridData, row: IFormConfigDialogHierarchialGridData): void {
		const array = group.childItems;
		const rowIndex = array.indexOf(row);
		const nextRow = group.childItems[rowIndex + 1];
		group.childItems[rowIndex + 1] = row;
		group.childItems[rowIndex] = nextRow;
	}

	/**
	 * When current item is row and excute movedown.
	 *
	 * @param row Row to shift.
	 * @param type Shift direction(up/down/top/bottom).
	 */
	private moveDownRow(row: IFormConfigDialogHierarchialGridData, type: FormConfigDialogEntityShiftType): void {
		const group = this.getGroupByRow(row);

		if (!group) {
			return;
		}

		if (this.isLastRowInGroup(row, group) && this.isLastGroup(group)) {
			return;
		}

		if (this.isLastRowInGroup(row, group) && !this.isLastGroup(group)) {
			this.moveRowToNextGroup(group, row);
		} else if (type === FormConfigDialogEntityShiftType.Bottom) {
			this.moveRowToBottomInGroup(group, row);
		} else {
			this.moveRowDownInGroup(group, row);
		}
	}

	/**
	 * When current item is group and  excute movedown.
	 *
	 * @param group Group to shift.
	 * @param type Shift direction(up/down/top/bottom).
	 */
	private moveDownGroup(group: IFormConfigDialogHierarchialGridData, type: FormConfigDialogEntityShiftType): void {
		if (this.isLastGroup(group)) {
			return;
		}

		if (type === FormConfigDialogEntityShiftType.Bottom) {
			this.hierarchialData[0].childItems = sortBy(this.hierarchialData[0].childItems, function (item) {
				return item.id === group.id ? 1 : 0;
			});
		} else {
			const groupIndex = this.hierarchialData[0].childItems.indexOf(group);
			const nextGroup = this.hierarchialData[0].childItems[groupIndex + 1];
			this.hierarchialData[0].childItems[groupIndex + 1] = group;
			this.hierarchialData[0].childItems[groupIndex] = nextGroup;
		}
	}

	/**
	 * Shifts item down.
	 *
	 * @param type Shift direction(up/down/top/bottom).
	 * @param selectedItem Item to be shifted.
	 */
	private moveDown(type: FormConfigDialogEntityShiftType, selectedItem: IFormConfigDialogHierarchialGridData): void {
		if (!selectedItem.parent) {
			return;
		}

		if (selectedItem.parent === this.rootItemId) {
			this.moveDownGroup(selectedItem, type);
		} else {
			this.moveDownRow(selectedItem, type);
		}
	}

	/**
	 * Converts flat data to hierarchial data.
	 *
	 * @param items Dialog flat data.
	 * @param parentId Parent id.
	 */
	private setHierarchialGridData<T extends IFormConfigDialogData>(items: IFormConfigDialogGridData<T>[]): void {
		function recurse(data: IFormConfigDialogGridData<T>[], parentId: GridItemId): IFormConfigDialogHierarchialGridData<T>[] {
			return items
				.filter((item) => item.parent === parentId)
				.map((item) => ({
					...item,
					childItems: recurse(items, item.id),
				}));
		}

		this.hierarchialData = [
			{
				childItems: recurse(items, this.rootItemId),
				...items.filter((ite) => ite.id === this.rootItemId)[0],
			},
		];
	}

	/**
	 * Converts hierarchial data to flat data.
	 *
	 * @param data Hierarchial data.
	 * @returns Flat data.
	 */
	private getFlatData<T extends IFormConfigDialogData>(data: IFormConfigDialogHierarchialGridData[]): IFormConfigDialogGridData<T>[] {
		const flatArray: IFormConfigDialogHierarchialGridData<T>[] = [];

		function recurse(node: IFormConfigDialogHierarchialGridData) {
			flatArray.push(node);

			if (node.childItems) {
				for (const child of node.childItems) {
					recurse(child);
				}
			}
		}

		recurse(data[0]);

		const result = flatArray.map(({ childItems, ...rest }) => rest);

		return result as IFormConfigDialogGridData<T>[];
	}

	/**
	 * Returns selected item.
	 *
	 * @param id Selected item id.
	 * @param data Grid data in hierarchial form.
	 * @returns Selected Item.
	 */
	private getSelectedItem(id: GridItemId, data: IFormConfigDialogHierarchialGridData[]): IFormConfigDialogHierarchialGridData | undefined {
		for (const item of data) {
			if (item.id === id) {
				return item;
			}
			if (item.childItems) {
				const found = this.getSelectedItem(id, item.childItems);
				if (found) {
					return found;
				}
			}
		}

		return undefined;
	}

	/**
	 * Refreshes grid with new items.
	 *
	 * @param context Grid context
	 * @param selectedItem Shifted item
	 */
	private refreshGrid<T extends IFormConfigDialogData>(context: IGridDialog<IFormConfigDialogGridData<T>>, selectedItem: IFormConfigDialogHierarchialGridData): void {
		context.items.length = 0;
		context.items.push(...this.getFlatData<T>(this.hierarchialData));
		context.gridRef.refresh();
		context.gridRef.selection = context.items.filter((ite) => ite.id === selectedItem.id);
	}
}
