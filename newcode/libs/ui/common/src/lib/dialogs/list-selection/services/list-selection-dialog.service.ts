/*
 * Copyright(c) RIB Software GmbH
 */
import { cloneDeep, isNil } from 'lodash';
import { Injectable, inject } from '@angular/core';

import { ListSelectionDialogComponent } from '../components/list-selection-dialog/list-selection-dialog.component';

import { SimpleId } from '@libs/platform/common';
import { IListSelectionDialog } from '../model/list-selection-dialog.interface';
import { IListSelectionDialogOptions } from '../model/list-selection-dialog-options.interface';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '../../base';
import { IAvailableItemsInfo, IListSelectionDialogData, getArrayAsSetObject, getItemId, getListSelectionDialogDataToken } from '../model/list-selection-dialog-data.interface';



/**
 * This service displays list selection modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonListSelectionDialogService {
	/**
	 * Opens/Closes dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Displays a custom dialog box.
	 *
	 * @typeParam T The value type to edit in the dialog. If the dialog is
	 * there only to display some data.
	 * @param { IListSelectionDialogOptions<TItem>} options An object that contains configuration options for
	 *   the dialog box.
	 * @returns { Promise<IEditorDialogResult<TItem[]>> | undefined } Result of the dialog.
	 */
	public show<TItem extends object>(options: IListSelectionDialogOptions<TItem>): Promise<IEditorDialogResult<TItem[]>> | undefined {
		const dialogData = this.getDialogData(options);

		dialogData.value.map((selItem, index) => {
			const itemObj = selItem;
			itemObj[dialogData.temporarySelectedIdProperty] = (index + 1) as TItem[keyof TItem];
			return itemObj;
		});

		const effectiveConfig = this.modalDialogService.createOptionsForCustom<IListSelectionDialog<TItem>, IListSelectionDialogOptions<TItem>, TItem[], ListSelectionDialogComponent<TItem>>(
			options,
			(info) => info.body.dialogInfo,
			ListSelectionDialogComponent<TItem>,
			[
				{
					provide: getListSelectionDialogDataToken<TItem>(),
					useValue: dialogData,
				},
			],
		);

		if (!effectiveConfig.buttons || (effectiveConfig.buttons && !effectiveConfig.buttons.length)) {
			effectiveConfig.buttons = [
				{
					id: StandardDialogButtonId.Ok,
					isDisabled: () => {
						return dialogData.value ? !dialogData.value.length : true;
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
				},
			];
		}

		return this.modalDialogService.show(effectiveConfig)?.then((result) => {
			const val: TItem[] = [];

			dialogData.value.forEach((res) => {
				delete res[dialogData.temporarySelectedIdProperty];
				const orginalItem = dialogData.findAvailableItemById(res[dialogData.idProperty]);
				if (orginalItem) {
					val.push(cloneDeep({...orginalItem, ...res}));
				}
			});

			return {
				closingButtonId: result.closingButtonId,
				value: val,
			};
		});
	}

	/**
	 * Returns the dialog body specific data.
	 *
	 * @param { IListSelectionDialogOptions<TItem>} options An object that contains configuration options for
	 * the dialog box.
	 * @returns { IListSelectionDialogData<TItem> } Dialog body data.
	 */
	private getDialogData<TItem extends object>(options: IListSelectionDialogOptions<TItem>): IListSelectionDialogData<TItem> {
		const data: IListSelectionDialogData<TItem> = {
			...{
				availableTitle: {
					key: 'platform.listselection.available',
				},
				selectedTitle: {
					key: 'platform.listselection.selected',
				},
				value: [],
				isSelectable: (entity: TItem, dialogData: IListSelectionDialog<TItem>) => {
					if (options.availableGridConfig.treeConfiguration?.children) {
						const children = options.availableGridConfig.treeConfiguration?.children(entity);
						return children.length <= 0;
					} else {
						return true;
					}
				},
				hideWithoutChildren: function (entity: TItem, dialogData: IListSelectionDialog<TItem>) {
					if (this.isSelectable && this.isSelectable(entity, dialogData)) {
						return false;
					}

					return !!options.availableGridConfig.treeConfiguration?.children;
				},
				temporarySelectedIdProperty: '__selItemId' as keyof TItem,
				getItemId: function (item: TItem) {
					return item[this.idProperty];
				},
				getSelectedItemId: function (item: TItem) {
					return item[this.temporarySelectedIdProperty];
				},
				getAvailableItems: function (dialogData: IListSelectionDialog<TItem>):IAvailableItemsInfo<TItem> {
					const idProp = this.idProperty;

					const parentMap = new Map<SimpleId, TItem>();
					const childrenMap = new Map<SimpleId, TItem[]>();

					function generateMapData(avItems: TItem[]) {
						avItems.forEach((avItem) => {
							const children: TItem[] = options.availableGridConfig.treeConfiguration?.children ? options.availableGridConfig.treeConfiguration.children(avItem) : [];

							for (const child of children) {
								const childId = getItemId(child, idProp);
								if (isNil(childId)) {
									throw new Error(`An available item for list selected dialog has no ID in its ${String(idProp)} field.`);
								}
								parentMap.set(childId, avItem);
							}

							const parentId = getItemId(avItem, idProp);
							if (isNil(parentId)) {
								throw new Error(`An available item for list selected dialog has no ID in its ${String(idProp)} field.`);
							}
							childrenMap.set(parentId, children);
						});
					}

					generateMapData(this.allItems);

					function getItems(itemList: TItem[], that: IListSelectionDialogData<TItem>):TItem[] {
						return itemList
							.map(function (avItem) {
								if (that.isSelectable && that.isSelectable(avItem, dialogData)) {
									const isPresent = that.value.find((selItem) => {
										return that.getItemId(avItem) === that.getItemId(selItem);
									});

									const allowMultiple = typeof that.canInsertMultiple === 'function' ? that.canInsertMultiple(avItem, dialogData) : that.canInsertMultiple;

									if (!allowMultiple && isPresent) {
										return null;
									}
								}

								const avItemId = getItemId(avItem, idProp);
								let children = avItemId ? childrenMap.get(avItemId) : undefined;
								if (Array.isArray(children)) {
									children = getItems(children, that);
								}
								if (that.hideWithoutChildren && that.hideWithoutChildren(avItem, dialogData)) {
									const hasChildren = Array.isArray(children) && children.length > 0;
									if (!hasChildren) {
										return null;
									}
								}

								return cloneDeep(avItem);
							}).filter(avItem => !!avItem) as TItem[];
					}

					return {
						items: getItems(this.allItems,this),
						parentOf: item => {
							const itemId = getItemId(item, idProp);
							return (itemId === undefined || itemId === null) ? undefined : parentMap.get(itemId);
						},
						childrenOf: item => []
					};
				},
				findAvailableItemById: function (id: TItem[keyof TItem]) {
					let result = null;
					this.allItems.some((item) => {
						if (this.getItemId(item) === id) {
							result = item;
							return true;
						}

						return false;
					});

					return result;
				},
				getSelectedItems: function () {
					const data = this.value
						.map((selItem) => {
							const id = this.getItemId(selItem);
							const itemDef = this.findAvailableItemById(id);
							if (itemDef) {
								return Object.assign(cloneDeep(itemDef), selItem);
							} else {
								return null;
							}
						})
						.filter((val) => val !== null);

					return data as TItem[];
				},
				getAllSelectableItems: function (dialogData: IListSelectionDialog<TItem>) {
					const result: TItem[] = [];

					this.allItems.forEach((item) => {
						if (this.isSelectable && this.isSelectable(item, dialogData)) {
							result.push(item);
						}
					});

					return result;
				},
				generateSelectedItemId: function () {
					const existingIds = getArrayAsSetObject(this.value, this.getSelectedItemId.bind(this));

					for (let id = 1; ; id++) {
						if (!existingIds[id]) {
							return id as TItem[keyof TItem];
						}
					}
				},
				createSelectedItem: function (id: TItem[keyof TItem]) {
					const generatedId = this.generateSelectedItemId();
					const newSelItem = {
						[this.idProperty]: id,
						[this.temporarySelectedIdProperty]: generatedId,
					};

					return newSelItem as TItem;
				},
			},
			...options,
		};

		return data;
	}
}
