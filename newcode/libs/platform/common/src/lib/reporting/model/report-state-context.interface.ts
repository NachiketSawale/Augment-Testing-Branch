/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Report context data.
 */
export interface IReportStateContext {
	/**
	 * Unique context id.
	 */
	readonly id: number;

	/**
	 * Context description key.
	 */
	readonly description$tr$: string;
}
