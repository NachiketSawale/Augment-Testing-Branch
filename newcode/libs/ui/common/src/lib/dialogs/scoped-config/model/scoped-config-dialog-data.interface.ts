/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { IScopedConfigDialogFormData } from './scoped-config-dialog-form-data.interface';
import { IAccessScopeInfo } from '@libs/platform/common';

/**
 * Dialog body data.
 */
export interface IScopedConfigDialogData<T extends object> {
	/**
	 * Data for different fallback levels accessible via 'id'.
	 */
	byName: { [key: string]: IScopedConfigDialogFormData<T> };

	/**
	 * Data for different fallback levels in ordered manner'.
	 */
	ordered: IScopedConfigDialogFormData<T>[];

	/**
	 * Stores information about Access Scopes.
	 */
	items: IAccessScopeInfo[];
}

/**
 * Token for dialog body data.
 */
const SCOPED_CONFIG_DIALOG_DATA_TOKEN = new InjectionToken('dlg-data');

/**
 * Function returns Token for dialog body data.
 *
 * @returns {InjectionToken<IScopedConfigDialogData<T>>} Token for dialog body data.
 */
export function getScopedConfigDialogDataToken<T extends object>(): InjectionToken<IScopedConfigDialogData<T>> {
	return SCOPED_CONFIG_DIALOG_DATA_TOKEN;
}
