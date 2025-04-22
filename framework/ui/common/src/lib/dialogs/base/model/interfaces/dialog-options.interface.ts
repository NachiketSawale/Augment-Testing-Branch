/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

import { IDialogButtonBase } from './dialog-button-base.interface';
import { IDialogDoNotShowAgain } from './dialog-do-not-showagain.interface';
import { IDialogBodyDescriptionBase } from './dialog-body-description-base.interface';
import { IDialog } from './dialog.interface';
import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Common dialog data interface.
 *
 * @group Dialog Framework
 */
export interface IDialogOptions<TDialog extends IDialog<TDetailsBody>, TDetailsBody = void> {
	/**
	 * Unique id for dialog to save settings on module level.
	 */
	id?: string;

	// TODO: Check this and make sure it actually has the desired effect.
	/**
	 * Controls presence of a backdrop. Allowed values: true, false (no backdrop), 'static'.
	 */
	backdrop?: 'static' | boolean;

	// TODO: check type for these properties (top/left/...)
	/**
	 * Top position of dialog
	 */
	top?: string;

	/**
	 * Left position of dialog
	 */
	left?: string;

	/**
	 *The width size from the dialog.
	 *can insert px-values, %-values and the string "max" for max size.
	 */
	width?: string;

	/**
	 * The height size from the dialog.
	 * can insert px-values, %-values and the string "max" for max size.
	 */
	height?: string;

	/**
	 * Defines max height of the dialog.
	 */
	maxHeight?: string;

	/**
	 * The max width size from the dialog.
	 * can insert px-values, %-values and the string "max" for max size.
	 */
	maxWidth?: string;

	/**
	 *The min width size from the dialog.
	 *can insert px-values, %-values and the string "max" for max size.
	 */
	minWidth?: string;

	/**
	 * Defines minheight of dialog
	 */
	minHeight?: string;

	/**
	 * Additional classes to be added to the dialog window to make it easier to identify
	 * and select the window with css selectors
	 */
	windowClass?: string;

	/**
	 * Additional classes to be added to the dialogs body.
	 */
	bodyCssClass?: string;

	/**
	 * An array of buttons that are right-aligned in the dialog footer.
	 * Only here standard buttons can be inserted.
	 */
	buttons?: IDialogButtonBase<TDialog, TDetailsBody>[];

	/**
	 * An array of custom buttons that are left-aligned in the dialogs footer.
	 */
	customButtons?: IDialogButtonBase<TDialog, TDetailsBody>[];

	/**
	 * Defines the option to "don't show again" this dialog. An ID must have been set for this.
	 */
	dontShowAgain?: IDialogDoNotShowAgain | boolean;

	/**
	 * Pressing the Enter key triggers the click event handler of the button
	 * with the corresponding ID.
	 */
	defaultButtonId?: StandardDialogButtonId | string;

	/**
	 * If false then the close (X) button in the default header will be removed.
	 */
	showCloseButton?: boolean;

	/**
	 * A boolean value which indicates whether the margin of the dialog body is large.
	 */
	bodyLargeMargin?: boolean;

	/**
	 * A boolean value which indicates whether the direction of the flexible items
	 * inside the dialog body template is set to column.
	 */
	bodyFlexColumn?: boolean;

	/**
	 * Indicates whether the modal popup is resizeable.
	 */
	resizeable?: boolean;

	/**
	 * Indicates whether the dialog should be closable by hitting the ESC key.
	 */
	keyboard?: boolean;

	/**
	 * The title text in the header area of the dialog.
	 */
	headerText?: Translatable;

	/**
	 * An additional text that is displayed in the upper part of the dialog body.
	 * This serves as a de-scription for the dialog.
	 */
	topDescription?: IDialogBodyDescriptionBase | Translatable;

	/**
	 * An additional text that is displayed in the lower part of the dialog body.
	 * This can be used for fur-ther information.
	 */
	bottomDescription?: IDialogBodyDescriptionBase | Translatable;
}
