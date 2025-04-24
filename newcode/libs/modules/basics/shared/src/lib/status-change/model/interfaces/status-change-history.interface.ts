/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IStatusChangeHistory {
	//TODO: should extend from entity base with the typical fields.
	/**
	 * id of the history record
	 */
	Id: number;
	/**
	 * entity id
	 */
	ObjectId: number;
	/**
	 * entity PKey1
	 */
	ObjectPKey1?: number;
	/**
	 * entity PKey2
	 */
	ObjectPKey2?: number;
	/**
	 * Old status
	 */
	StatusOldFk: number;
	/**
	 * New status
	 */
	StatusNewFk: number;
	/**
	 * Remark
	 */
	Remark: string;
	/**
	 * insert date
	 */
	InsertedAt: Date;
	/**
	 * insert date
	 */
	InsertedBy: number;
}
