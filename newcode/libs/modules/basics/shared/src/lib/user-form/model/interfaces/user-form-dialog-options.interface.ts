/*
 * Copyright(c) RIB Software GmbH
 */

import { IEditorDialog, IEditorDialogOptions } from '@libs/ui/common';
import { IUserFormData } from './user-form-data.interface';

/**
 * User form editor dialog.
 */
export interface IUserFormEditorDialog extends IEditorDialog<IUserFormData[]> {
	saving?: boolean;
}

/**
 * User form dialog options.
 */
export interface IUserFormDialogOptions extends IEditorDialogOptions<IUserFormData[], IUserFormEditorDialog> {
	url: string;
	onLoaded?: (window: Window) => void;
}