/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IReportParameter } from './report-parameter.interface';

/**
 * Report error data interface.
 */
export interface IReportError {
	/**
	 * Parameters of report.
	 */
	parameter: IReportParameter;

	/**
	 * Report context id(0 .... 11)
	 */
	context: string;

	/**
	 * Error description.
	 */
	text: string;
}
