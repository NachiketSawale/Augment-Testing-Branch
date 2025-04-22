/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * An overlay that displays some information.
 */
export interface IInfoOverlay {

	/**
	 * Gets or sets the text to display.
	 */
	info: Translatable;

	/**
	 * Gets or sets whether the overlay is being displayed.
	 */
	visible: boolean;

	/**
	 * Shows the overlay and displays a text.
	 * @param info The text to display.
	 */
	showInfo(info: Translatable): void;
}
