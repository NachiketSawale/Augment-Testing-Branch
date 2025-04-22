/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report prepare data interface.
 */
export interface IReportPrepareData {
	/**
	 * Name of report.
	 */
	Name: string;

	/**
	 * Report file name.
	 */
	TemplateName: string;

	/**
	 * Report path.
	 */
	Path: string;

	/**
	 * Report unique id.
	 */
	Id: number;

	/**
	 * Boolean for limited waiting time.
	 */
	limitedWaitingTime?: boolean;

	/**
	 * True if interactive viewer should be used
	 */
	interactive?: boolean;
}
