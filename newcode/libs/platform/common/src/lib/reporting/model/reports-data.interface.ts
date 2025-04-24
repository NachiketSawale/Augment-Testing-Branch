/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Group reports data.
 */
export interface IReportsData {
	/**
	 * Unique report id.
	 */
	id: number;

	/**
	 * Group Id in which report is present.
	 */
	groupId: number;

	/**
	 * Name of the report.
	 */
	name: string;

	/**
	 * Description of the report.
	 */
	text: string;

	/**
	 * File name of the report.
	 */
	filename: string;

	/**
	 * Path of the report.
	 */
	path: string;

	/**
	 * Parameters of the report.
	 */
	parameters: number;

	/**
	 * Boolean storing state.
	 */
	storeInDocs: boolean;

	/**
	 * Boolean storing state.
	 */
	storeInDocsState: boolean;

	/**
	 * Document category number.
	 */
	documentCategory: number | null;

	/**
	 * Document type number.
	 */
	documentType: number | null;

	/**
	 * Rubic category number.
	 */
	rubricCategory: number | null;
}
