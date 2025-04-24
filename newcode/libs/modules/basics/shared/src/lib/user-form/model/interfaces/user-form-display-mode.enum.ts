/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The display mode of user form in application.
 */
export enum UserFormDisplayMode {
	/**
	 * Show user form in the new window.
	 */
	Window,

	/**
	 * Show user form in the model dialog.
	 */
	Dialog,

	/**
	 * Show user form in a specified div element.
	 */
	Container,

	/**
	 * Show user form in a specified iframe element.
	 */
	IFrame
}