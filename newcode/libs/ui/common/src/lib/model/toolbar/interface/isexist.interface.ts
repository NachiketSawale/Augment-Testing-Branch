/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * The interface is for item exist or not.
 */

export interface IIsExist {
	/**
	 * 	Index number.
	 */
	index: number;

	/**
	 * 	to check is exist or not.
	 */
	isExists: boolean;
}