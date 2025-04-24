import {InjectionToken} from '@angular/core';
import {SubEntityInDialogDataService} from '../components/sub-entity-grid-dialog.component';
import {
	IDialog,
	IDialogOptions,
	IGridConfiguration,
	IMenuItemsList
} from '@libs/ui/common';

export interface ISubEntityDialog {
	setTemporary(): void;
}

export const SUB_ENTITY_DATA_SERVICE_TOKEN = new InjectionToken<SubEntityInDialogDataService>('sub-entity-data-service');

export interface ISubEntityGridDialog extends IDialog {
	dataService: SubEntityInDialogDataService,
}

export interface ISubEntityGridDialogOptions<TItem extends object> extends IDialogOptions<ISubEntityGridDialog> {
	/**
	 * Indicates whether multiple rows in the grid may be selected at a time.
	 * The default value is `true`.
	 */
	allowMultiSelect?: boolean;

	/**
	 * Indicates whether the dialog exists only for information purposes and should therefore
	 * only have an *OK* button (unless you define any buttons on the options object).
	 * The default value is `false`.
	 * Note that this setting does not have any influence on the content of the dialog box.
	 */
	isReadOnly?: boolean;

	/**
	 * Configuration options for the grid in the dialog box, including the list of columns.
	 */
	gridConfig: Omit<IGridConfiguration<TItem>, 'items'>;

	/**
	 * Custom tools
	 */
	tools?: IMenuItemsList<ISubEntityGridDialog>;
}