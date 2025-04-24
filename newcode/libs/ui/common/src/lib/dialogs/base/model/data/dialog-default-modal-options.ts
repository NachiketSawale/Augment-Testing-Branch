/*
 * Copyright(c) RIB Software GmbH
 */

import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Constant holding the default values for dialog options properties.
 */
export const DialogDefaultModalOptions = {
	/**
	 * Includes a modal-backdrop element.
	 */
	backdrop: 'static',

	/**
	 * Closes the modal when escape key is pressed.
	 */
	keyboard: true,

	/**
	 * Max height from dialog window.
	 */
	maxHeight: 'max',

	/**
	 * Max height from dialog window.
	 */
	maxWidth: 'max',

	/**
	 * Min width from dialog window.
	 */
	minWidth: 'min',

	/**
	 * Indicates whether dialog is resizable.
	 */
	resizeable: false,

	/**
	 * Icon class for message type
	 */
	iconClass: undefined,

	/**
	 * Unique identifier for dialog.
	 */
	id: '',

	/**
	 * Height of the dialog.
	 */
	height: '',

	/**
	 * Width of the dialog.
	 */
	width: '',

	/**
	 * Additional classes to be added to the dialog window to make it easier to identify
	 * and select the window with css selectors.
	 */
	windowClass: '',

	/**
	 *  the 'X' Button in the default header to close the dialog.
	 */
	showCloseButton: true,

	/**
	 * Additional classes to be added to the dialogs body.
	 */
	bodyCssClass: '',

	/**
	 * The title text in the header area of the dialog.
	 */
	headerText: '',

	/**
	 * Dialog standard buttons(aligned right).
	 */
	buttons: [],

	/**
	 * Dialog custom buttons(aligned left).
	 */
	customButtons: [],

	/**
	 * Defines the option to "don't show again" this dialog. An ID must have been set for this.
	 */
	dontShowAgain: { showOption: false, defaultActionButtonId: StandardDialogButtonId.Ok, activated: false },

	/**
	 * Pressing the Enter key triggers the click event handler of the button
	 * with the corresponding ID.
	 */
	defaultButtonId: '',
};
