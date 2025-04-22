/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface for desktop page definition.
 */
export interface IDesktopPager {
	/**
	 * The total page of desktop module.
	 */
	totalPages: number;

	/**
	 * The current page of desktop module.
	 */
	currentPage: number;
}
