/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * The interface that provides the required information for the dialog header.
 *
 * @see {@link IDialogFooterModel}
 *
 * @group Dialog Framework
 */
export interface IDialogHeaderModel {

	/**
	 * The text displayed in the header.
	 */
	readonly headerText?: Translatable;

	/**
	 * Indicates whether or not to show a close button.
	 */
	readonly showCloseButton?: boolean;

	/**
	 * Closes the dialog as a result of a mouse click and indicates a *Cancel* action.
	 *
	 * @param evt The mouse event.
	 */
	cancel(evt: MouseEvent): void;
}
