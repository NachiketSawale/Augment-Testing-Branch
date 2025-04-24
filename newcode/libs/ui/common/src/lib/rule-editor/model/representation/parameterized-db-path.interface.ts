/*
 * Copyright(c) RIB Software GmbH
 */

export interface IParameterizedDbPath {
	/**
	 * Path
	 */
	Path: string[];

	/**
	 * Parameters
	 */
	Parameters: unknown[];
}