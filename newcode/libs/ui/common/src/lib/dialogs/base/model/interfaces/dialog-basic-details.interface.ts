/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Type } from '@angular/core';

/**
 * Detail dialog data interface.
 *
 * @group Dialog Framework
 */
export interface IModalBasicDetails {
	/**
	 * Type of dialog(longtext, component, grid).
	 */
	type?: string;

	/**
	 * Template for details dialog.
	 */
	templateUrl?: Type<unknown>;

	/**
	 * Template string for details dialog.
	 */
	value?: string;

	/**
	 * Cssclass for details element.
	 */
	cssClass?: string;

	/**
	 * Boolean to show/hide the details
	 */
	show?: boolean;

	/**
	 * Texts containing button caption['ShowDetails','HideDetails']
	 */
	texts?: string[];
}
