/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Structure used to generate the url for loading the entity fields info
 */
export interface IEntityFieldTreeSelectionOptions {
	/**
	 * alongPath
	 */
	alongPath: string;

	/**
	 * maxDepth
	 */
	maxDepth: number;

	/**
	 * moduleName
	 */
	moduleName: string;

	/**
	 * tableName
	 */
	tableName: string;
}