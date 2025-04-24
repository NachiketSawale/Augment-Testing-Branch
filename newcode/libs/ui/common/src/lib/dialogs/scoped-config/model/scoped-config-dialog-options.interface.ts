/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IFormConfig
} from '../../../form/index';
import {
	IEditorDialog,
	IEditorDialogOptions
} from '../../index';
import { AccessScopedPermissions } from '@libs/platform/common';
import { IScopedConfigDialogState } from './scoped-config-dialog-state.interface';

/**
 * This interface specifies configuration options for a scoped config dialog.
 *
 * @typeParam T The object type edited in the dialog box.
 *
 * @group Dialogs
 */
export interface IScopedConfigDialogConfig<T extends object> extends IEditorDialogOptions<IScopedConfigDialogState<T>, IEditorDialog<IScopedConfigDialogState<T>>> {

	/**
	 * A form configuration object that is shown on each tab.
	 * The object will not be modified.
	 * It will merely be used as a template for the internally generated replicated and adapted forms.
	 *
	 * The form configuration does not need to care about the checkboxes for inheriting values.
	 * These are added automatically.
	 *
	 * @see {@link IFormConfig}
	 */
	readonly formConfiguration: IFormConfig<Partial<T>>;

	/**
	 * An object that stores fallback values.
	 * It is, so-to-speak, the access scope level above the global one, the level that settings
	 * are inherited from if they are not input on the global tab.
	 *
	 * If this object is not set, the checkboxes for disabling form rows will not be added on
	 * the global tab.
	 */
	readonly fallbackValue?: Partial<T>;
	
	/**
	 * An object that specifies the required permissions for modifying settings on each access scope.
	 */
	readonly permissions: AccessScopedPermissions;
}
