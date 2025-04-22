/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report user settings interface.
 */
export interface IReportUserSettings {
	/**
	 * User setting data.
	 */
	report: IReportUserSettingsData;
}

/**
 * User setting data interface.
 */
export interface IReportUserSettingsData {
	/**
	 * Selected language.
	 */
	language: string;

	/**
	 * Pinned elements.
	 */
	pinState: IReportPinState[];

	/**
	 * Expanded group items.
	 */
	expandState: number[];
}

/**
 * Pinned element interface.
 */
export interface IReportPinState {
	/**
	 * Item id.
	 */
	id: number | string;

	/**
	 * Group id in which item is present.
	 */
	groupId: number | undefined;
}
