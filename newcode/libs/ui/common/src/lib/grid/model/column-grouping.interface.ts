/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Properties to configure grouping of column
 */
export interface IColumnGroupingProperties {

	/**
	 * Title of the Grouping
	 */
	title: string;

	/**
	 * The property used to group with
	 */
	getter: string;

	/**
	 * Aggregators
	 */
	aggregators: [];

	/**
	 * Aggregators collapsed
	 */
	aggregateCollapsed: boolean;

	/**
	 * Generic
	 */
	generic: boolean;
}