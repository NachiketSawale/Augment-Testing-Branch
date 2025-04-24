/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Quickstart settings data from server.
 */
export interface IQuickstartMergedSetting {
	/**
	 * Use settings.
	 */
	useSettings: boolean;

	/**
	 * show pages available.
	 */
	showPages: boolean;

	/**
	 * show tabs available.
	 */
	showTabs: boolean;

	/**
	 * Module details.
	 */
	modules: Array<string>;
}
