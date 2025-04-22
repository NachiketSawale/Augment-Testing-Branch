/*
 * Copyright(c) RIB Software GmbH
 */
import { IFormDialog } from './form-dialog.interface';
import { IDialogOptions } from '../../../base';
import { IFormDialogData } from './form-dialog-data.interface';

/**
 * This interface represents a configuration object that can be processed by the form dialog.
 *
 * @typeParam T The object type edited in the form.
 *
 * @group Dialogs
 */
export interface IFormDialogConfig<T extends object> extends IDialogOptions<IFormDialog<T>>, IFormDialogData<T> {
	/**
	 * Property holding form control data.
	 */
	entity: T;

	/**
	 * Property to show/hide Cancel button.
	 */
	showCancelButton?: boolean;

	/**
	 * Property to show/hide Ok button.
	 */
	showOkButton?: boolean;
}
