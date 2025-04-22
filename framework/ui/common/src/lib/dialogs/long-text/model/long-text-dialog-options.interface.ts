/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { TextDisplayType } from '../../../model/text-display/enums/text-display-type.enum';
import { IDialog, IDialogOptions } from '../../base';

/**
 * Body specific data.
 */
export interface ILongTextDialogBodyData {
	/**
	 * Body source data.
	 */
	readonly text: string;

	/**
	 * Data display type.
	 */
	readonly type: TextDisplayType;
}

/**
 * Stores options for long text dialog.
 */
export type ILongTextDialogOptions = ILongTextDialogBodyData & IDialogOptions<IDialog>;

/**
 * Token for dialog body data.
 */
export const LONG_TEXT_DIALOG_BOX_OPTIONS = new InjectionToken<ILongTextDialogOptions>('long-text-dialog-box-options');
