/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * The Interface for Pagination
 */
export interface IPagination {

	/**
	 * The Index Number
	 */
	index: number;

	/**
	 * The pages count
	 */
	maxPageSize: number;

	/**
	 * The Pages
	 */
	pages: number[];
}