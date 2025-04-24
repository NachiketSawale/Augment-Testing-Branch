/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Provides aggregation types
 */
export enum AggregationType {

	/**
	 * Sum aggregation function
	 */
	Sum = 'sum',

	/**
	 * Average aggregation function
	 */
	Avg = 'avg',

	/**
	 * Min aggregation function
	 */
	Min = 'min',

	/**
	 * Max aggregation function
	 */
	Max = 'max',

	/**
	 * no aggregation specified
	 */
	None = 'none',

	/**
	 * default aggregation function
	 */
	Default = AggregationType.Sum
}