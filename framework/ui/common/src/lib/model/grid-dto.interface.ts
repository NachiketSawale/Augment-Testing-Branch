/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * interface for grid dto
 */
export interface IGridDto{
	/**
	 * Grid column labels
	 */
	Headers: string[],

	/**
	 * items in the grid as rows
	 */
	Rows: object[],

	/**
	 * tree existence
	 */
	IsTreegrid:boolean,

	/**
	 * container name
	 */
	ContainerName: string
}