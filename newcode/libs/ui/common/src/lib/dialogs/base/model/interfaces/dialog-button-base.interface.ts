/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { IDialog } from './dialog.interface';
import { DialogButtonSettingFunc } from '../dialog-setting-func.type';
import { DialogButtonEventHandlerFunc } from '../dialog-button-event-handler-func.type';
import { IButtonInfo } from './button-info.interface';
import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Common dialog footer buttons data interface.
 *
 * @group Dialog Framework
 */
export interface IDialogButtonBase<TDialog extends IDialog<TDetailsBody>, TDetailsBody = void> extends IButtonInfo {

	/**
	 * Unique identifier of the button.
	 */
	id: StandardDialogButtonId | string;

	/**
	 * The caption of the button.
	 */
	caption?: DialogButtonSettingFunc<TDialog, Translatable, TDetailsBody> | Translatable;

	/**
	 * A property or a function which decides whether the button is visible.
	 */
	isVisible?: DialogButtonSettingFunc<TDialog, boolean, TDetailsBody> | boolean;

	/**
	 * A property or a function which decides whether the button is disabled.
	 */
	isDisabled?: DialogButtonSettingFunc<TDialog, boolean, TDetailsBody> | boolean;

	/**
	 * CSS class for the button-element
	 */
	cssClass?: string;

	/**
	 * CSS class to define an image for the button.
	 */
	iconClass?: string;

	/**
	 * A text or function that returns a text, which is used as a tooltip for the button
	 */
	tooltip?: DialogButtonSettingFunc<TDialog, string, TDetailsBody> | string;

	/**
	 * This function is executed when the button is pressed.
	 */
	fn?: DialogButtonEventHandlerFunc<TDialog, TDetailsBody>;

	/**
	 * If true, the dialog is automatically closed as soon as the button function is executed.
	 */
	autoClose?: boolean;
}
