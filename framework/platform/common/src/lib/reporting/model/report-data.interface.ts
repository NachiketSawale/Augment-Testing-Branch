/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReportsData } from './reports-data.interface';

/**
 * Reports data interface.
 */
export interface IReportData {
	/**
	 * Unique group id.
	 */
	id: number;

	/**
	 * Name of the group.
	 */
	name: string;

	/**
	 * Group visible state.
	 */
	visible: boolean;

	/**
	 * Group Icon.
	 */
	icon: string;

	/**
	 * Group reports data.
	 */
	reports: Array<IReportsData>;
}
