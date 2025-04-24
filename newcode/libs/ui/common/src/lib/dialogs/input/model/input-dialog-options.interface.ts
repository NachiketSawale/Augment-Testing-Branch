/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import {
	IEditorDialog,
	IEditorDialogOptions
} from '../../base/index';

/**
 * Input dialog options interface.
 *
 * @group Dialogs
 */
export interface IInputDialogOptions extends IEditorDialogOptions<string, IEditorDialog<string>> {

	/**
	 * Pattern for the input field.
	 */
	pattern?: string;

	/**
	 * Input type for input field.
	 */
	type?: string;

	/**
	 * Maximum length for the input field.
	 */
	maxLength?: string | number;

	/**
	 * Placeholder text for input field.
	 */
	placeholder?: Translatable;
}
