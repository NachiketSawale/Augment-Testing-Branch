/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The structure of request to load the entity schema
 */
export interface IFieldRequestParam {
	/**
	 * tableId
	 */
	tableId?: number;

	/**
	 * tableName
	 */
	tableName?:string;

	/**
	 * alongPath
	 */
	alongPath?: string;

	/**
	 * typeRestrictions
	 */
	typeRestrictions?: string;

	/**
	 * maxDepth
	 */
	maxDepth?: number;

	/**
	 * moduleName
	 */
	moduleName?: string;
}