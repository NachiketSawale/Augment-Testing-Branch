/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * Data used in Variable Time Period expression
 */
export interface IVariableTimePeriod {
	/***
	 * the unit of time
	 * 1 => Hour, 2 => Days, 3 => Weeks, 4 => Months, 5 => Years
	 */
	transformation: number;

	/***
	 * Lower bound. always negative
	 */
	lowerBound: number;

	/***
	 * Upper bound
	 */
	upperBound: number;
}