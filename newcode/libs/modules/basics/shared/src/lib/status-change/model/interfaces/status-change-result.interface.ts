/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * status change result
 */
export interface IStatusChangeResult {
	/**
	 * id
	 */
	Id?: number;
	/**
	 * error message
	 */
	ErrorMsg: string;
	/**
	 * result of change status success or not
	 */
	Result: boolean;
	/**
	 * Entity id
	 */
	EntityId?: number;

	/**
	 * Entity Code
	 */
	EntityCode?: string;

	/**
	 * Entity Description
	 */
	EntityDesc?: string | null;

	/**
	 * finish or fail
	 */
	Status?: string;
	/**
	 * the changing status entity
	 */
	Entity: object;
}
