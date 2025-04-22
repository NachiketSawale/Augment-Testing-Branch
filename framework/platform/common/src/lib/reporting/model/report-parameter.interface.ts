/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report parameter data interface.
 */
export interface IReportParameter {
	/**
	 * Parameter type(e.g. System.Int32)
	 */
	dataType?: string;

	/**
	 * Parameter visible state.
	 */
	isVisible?: boolean;

	/**
	 * Default value of the parameter.
	 */
	defaultValue?: string;

	/**
	 * Parameter name.
	 */
	name?: string | null;

	/**
	 * Parameter name.
	 */
	parameterName?: string;

	/**
	 * Parameter context id(0 ... 11).
	 */
	context?: number;

	/**
	 * Value of parameter.
	 */
	value?: IReportParameterValue;

	/**
	 * Parameter values in case of dropdown.
	 */
	values?: IReportParameterValues[];
}

/**
 * Report parameter values interface in case of dropdown.
 */
export interface IReportParameterValues {
	/**
	 * Display member.
	 */
	name: string;

	/**
	 * value member.
	 */
	value: number;
}

/**
 * Report parameter value type.
 */
export type IReportParameterValue = number | boolean | string | Date;
