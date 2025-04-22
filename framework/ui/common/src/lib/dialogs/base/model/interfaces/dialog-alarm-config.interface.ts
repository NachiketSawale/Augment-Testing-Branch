/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

// TODO: revise?
/**
 * Overlay message interface.
 *
 * @group Dialog Framework
 */
export interface IDialogAlarmConfig {
	/**
	 * Text to be displayed for the alarm message.
	 */
	info?: string;

	/**
	 * The CSS class of the overlay element.
	 */
	cssClass?: string;
}
