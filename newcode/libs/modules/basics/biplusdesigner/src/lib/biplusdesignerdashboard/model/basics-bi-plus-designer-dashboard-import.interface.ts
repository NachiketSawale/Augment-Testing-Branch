/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { ICustomDialog, IDialogButtonBase } from '@libs/ui/common';

/**
 * Dashboard Import Response
 */
export interface IDashboardImport {
	/**
	 * Delted Count
	 */
	Deleted: number;

	/**
	 * Description
	 */
	Description: string;

	/**
	 * Inserted Count
	 */
	Inserted: number;

	/**
	 * Updated Count
	 */
	Updated: number;
}

/**
 * Token for dialog body data.
 */
export const DASHBOARD_IMPORT_DIALOG_DATA_TOKEN = new InjectionToken('dashboard-import-data');

/**
 * Function returns Token for dialog body data.
 *@returns { InjectionToken<IDialogButtonBase<ICustomDialog<unknown,unknown,void>,void>[]>} Token for dialog body data.
 */
export function getDashboardImportDialogDataToken(): InjectionToken<IDialogButtonBase<ICustomDialog<unknown, unknown, void>, void>[]> {
	return DASHBOARD_IMPORT_DIALOG_DATA_TOKEN;
}
