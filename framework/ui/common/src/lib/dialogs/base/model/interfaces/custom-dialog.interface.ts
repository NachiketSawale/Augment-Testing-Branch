/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

import {
	IEditorDialog
} from '../..';
import { Translatable } from '@libs/platform/common';

/**
 * This is the base interface for an instance of a dialog box that can be used to edit a value.
 *
 * @group Dialog Framework
 */
export interface ICustomDialog<TValue, TBody, TDetailsBody = void> extends IEditorDialog<TValue, TDetailsBody> {

	/**
	 * The body component of the dialog.
	 */
	readonly body: TBody;

	/**
	 * Gets or sets the text in the header bar of the dialog box.
	 */
	headerText?: Translatable;
}

const CUSTOM_DLG_DATA_TOKEN = new InjectionToken('custom-dlg-data');

/**
 * Provides an injection token that can be used within custom dialog components to inject the
 * dialog reference.
 *
 * @group Dialog Framework
 */
export function getCustomDialogDataToken<TValue, TBody, TDetailsBody = void>(): InjectionToken<ICustomDialog<TValue, TBody, TDetailsBody>> {
	return CUSTOM_DLG_DATA_TOKEN;
}
