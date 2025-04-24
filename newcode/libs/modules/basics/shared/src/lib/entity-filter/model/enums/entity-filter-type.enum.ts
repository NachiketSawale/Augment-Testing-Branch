/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum for Material Filter Types
 */
export enum EntityFilterType {
	/** Indicates that filter value will be numeric */
	Numeric = 1,

	/** Indicates that filter value will be char */
	Char = 2,

	/** Indicates that filter value will be boolean */
	Boolean = 3,

	/** Indicates that filter value will be a list */
	List = 4,

	/** Indicates that filter value will be a list from grid view */
	Grid = 5,
	/**
	 * Indicates that filter value will be a date
	 */
	Date = 6,
}
