/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report parameters data interface.
 */
export interface IReportParametersData {
	/**
	 * Name of parameter.
	 */
	Name?: string;

	/**
	 * Parameter Description.
	 */
	Description?: string;

	/**
	 * Parameter Value.
	 */
	ParamValue?: string | null;

	/**
	 * .net Type (e.q. System.String).
	 */
	ParamValueType?: string;

	/**
	 * Option parameter.
	 */
	IsOptionParam?: boolean;

	/**
	 * Program param;
	 */
	IsProgramParam?: true;
}
