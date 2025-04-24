/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';

import { IFormConfig } from '../../../form';
import { IMasterDetailItem } from './master-detail-item.interface';
import { IMasterDetailEditingController } from './master-detail-editing-controller.interface';
import { IMasterDetailDialog } from './master-detail-dialog.interface';
import { ConcreteMenuItem } from '../../../model/menu-list/interface/index';

export type SimpleDataChangedProperty<T> = {
	[K in keyof T]: T[K] extends (boolean | undefined) ? K : never
}[keyof T];

/**
 * Dialog body data.
 */
export interface IMasterDetailDialogData<T extends object> {
	/**
	 * Optionally, a standard form configuration that will be shown in the detail
	 * area for each item without an individual form configuration.
	 */
	readonly defaultForm?: (info:IMasterDetailDialog<T>)=>IMasterDetailDialogDefaultFormData<T>;

	/**
	 * The items shown in the master list of the dialog box.
	 */
	readonly items: IMasterDetailItem<T>[];

	/**
	 * An optional object that provides editing commands for the list of master-detail items.
	 * If this is `undefined`, the dialog does not allow for editing items.
	 */
	readonly editing?: IMasterDetailEditingController<IMasterDetailItem<T>>;

	/**
	 * Custom ToolBar Items.
	 */
	customTools?: ConcreteMenuItem<IMasterDetailDialog<T>>[];

	/**
	 * An optional property present in entity.
	 */
	dataChangedMember?: SimpleDataChangedProperty<T>;
}

/**
 * Default form data.
 */
export interface IMasterDetailDialogDefaultFormData<T extends object> {
	/**
	 * Form.
	 */
	form: IFormConfig<T>

	/**
	 * Form entity.
	 */
	value?: T;
}

/**
 * Token for dialog body data.
 */
export const MASTER_DETAIL_DIALOG_DATA_TOKEN = new InjectionToken('dlg-master-detail-data');

/**
 * Function returns Token for dialog body data.
 *
 * @returns {InjectionToken<IMasterDetailDialogData<T>>} Token for dialog body data.
 */
export function getMasterDetailDialogDataToken<T extends object>(): InjectionToken<IMasterDetailDialogData<T>> {
	return MASTER_DETAIL_DIALOG_DATA_TOKEN;
}
