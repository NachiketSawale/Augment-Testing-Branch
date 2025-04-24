/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { IReadOnlyEntityRuntimeData } from '@libs/platform/data-access';
import { IFormConfig, FormDisplayMode } from '../../../../form';
import { IFormDialog } from './form-dialog.interface';

export interface IFormDialogData<T extends object> {
	/**
	 * The form configuration object ([see](@link IFormConfig))
	 */
	readonly formConfiguration: IFormConfig<T> | ((dialog: IFormDialog<T>) => IFormConfig<T>);

	/**
	 * Form display mode.
	 */
	displayMode?: FormDisplayMode;

	/**
	 * Entity run time data like validations, read-only...
	 */
	runtime?: IReadOnlyEntityRuntimeData<T>;
}

const FORM_DIALOG_DATA_TOKEN = new InjectionToken('dlg-form-data');

export function getFormDialogDataToken<T extends object>(): InjectionToken<IFormDialogData<T>> {
	return FORM_DIALOG_DATA_TOKEN;
}
