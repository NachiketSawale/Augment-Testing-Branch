/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPreviousPrcItemInfo {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * PrcHeaderFk
	 */
	PrcHeaderFk: number;

	/**
	 * PrcItemFk
	 */
	PrcItemFk?: number | null;

	/**
	 * Price
	 */
	Price: number;
}
