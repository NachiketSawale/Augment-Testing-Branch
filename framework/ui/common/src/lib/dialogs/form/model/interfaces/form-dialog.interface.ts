/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog } from '../../../base';
import { IFormConfig } from '../../../../form';
import { IReadOnlyEntityRuntimeData } from '@libs/platform/data-access';

/**
 * A runtime representation of a form dialog.
 *
 * @typeParam TValue The object type edited in the form.
 *
 * @group Dialogs
 */
export interface IFormDialog<TValue extends object> extends IEditorDialog<TValue> {

	/**
	 * Provides access to the form configuration.
	 */
	readonly formConfig: IFormConfig<TValue>;

	/**
	 * Refresh the form config object.
	 */
	refresh?(): IFormConfig<TValue>;

	/**
	 * Entity run time data.
	 */
	runtime?: IReadOnlyEntityRuntimeData<TValue>;
}