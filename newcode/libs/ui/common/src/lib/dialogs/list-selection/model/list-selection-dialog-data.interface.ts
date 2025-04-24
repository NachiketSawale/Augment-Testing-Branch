/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

import { SimpleId, SimpleIdProperty } from '@libs/platform/common';
import { IListSelectionDialog } from './list-selection-dialog.interface';
import { IListSelectionDialogBodyData } from './list-selection-dialog-body-data.interface';


/**
 * Body specific data for dialog.
 */
export type IListSelectionDialogData<T extends object> = IListSelectionDialogBodyData<T> & IListSelectionDialogAdditionalData<T>;

export interface IAvailableItemsInfo<T extends object> {
	/**
	 * Available items.
	 */
	readonly items: T[];

	/**
	 * Retrieves parent for the item.
	 */
	parentOf(item: T): T | undefined;

	/**
	 * Retrieves children for the items.
	 */
	childrenOf(item: T): T[];
}

/**
 * Additional data required for dialog body.
 */
export interface IListSelectionDialogAdditionalData<T extends object> {
	/**
	 * Dialog value
	 */
	value: T[];

	/**
	 * Temporary id for entity.
	 */
	temporarySelectedIdProperty: keyof T;

	/**
	 * Returns the id for entity item.
	 * @param item
	 * @returns T[keyof T]
	 */
	getItemId: (item: T) => T[keyof T];

	/**
	 * Returns the temporary id for entity item.
	 * @param item
	 * @returns T[keyof T]
	 */
	getSelectedItemId: (item: T) => T[keyof T];

	/**
	 * Returns the available entity items.
	 * @param dialogData
	 * @returns IAvailableItemsInfo<T>
	 */
	getAvailableItems: (dialogData: IListSelectionDialog<T>) => IAvailableItemsInfo<T>;

	/**
	 * Returns the selected items.
	 * @returns T[]
	 */
	getSelectedItems: () => T[];

	/**
	 * Returns the item whose id matches that of parameter.
	 * @param id
	 * @returns T|null
	 */
	findAvailableItemById: (id: T[keyof T]) => T | null;

	/**
	 * Returns the selectable items.
	 * @param dialogData
	 * @returns T[]
	 */
	getAllSelectableItems: (dialogData: IListSelectionDialog<T>) => T[];

	/**
	 * Generates new temporary id for entity.
	 * @returns T[keyof T]
	 */
	generateSelectedItemId: () => T[keyof T];

	/**
	 * Creates the selected item.
	 * @param id
	 * @returns T
	 */
	createSelectedItem: (id: T[keyof T]) => T;
}

/**
 * Token for dialog body data.
 */
export const LIST_SELECTION_DIALOG_DATA_TOKEN = new InjectionToken('dlg-list-selection-data');

/**
 * Function returns Token for dialog body data.
 *
 * @returns {InjectionToken<IListSelectionDialogData<T>>} Token for dialog body data.
 */
export function getListSelectionDialogDataToken<T extends object>(): InjectionToken<IListSelectionDialogData<T>> {
	return LIST_SELECTION_DIALOG_DATA_TOKEN;
}

/**
 * Returns array as set object.
 *
 * @param {TItem[]} array Entity values.
 * @param {ArrayAsObject} func Function to modify entities.
 * @returns Mapped array object.
 */
export function getArrayAsSetObject<TItem extends object>(array: TItem[], func: (item: TItem) => TItem[keyof TItem]) {
	const result: { [key: string]: boolean } = {};
	array.forEach(function (v) {
		result[func(v) as string] = true;
	});

	return result;
}

/**
 * Method returns item id.
 */
export function getItemId<TItem extends object>(item: TItem, idProp: SimpleIdProperty<TItem>): SimpleId | undefined {
	return <SimpleId | undefined>item[idProp];
}

