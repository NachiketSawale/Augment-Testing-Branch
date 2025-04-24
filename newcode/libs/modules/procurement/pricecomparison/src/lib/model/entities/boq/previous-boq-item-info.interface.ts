/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPreviousBoqItemInfo {
	/**
	 * BoqHeaderFk
	 */
	BoqHeaderFk: number;

	/**
	 * BoqItemPrjBoqFk
	 */
	BoqItemPrjBoqFk?: number | null;

	/**
	 * BoqItemPrjItemFk
	 */
	BoqItemPrjItemFk?: number | null;

	/**
	 * BoqItemQtnBoqFk
	 */
	BoqItemQtnBoqFk?: number | null;

	/**
	 * BoqItemQtnItemFk
	 */
	BoqItemQtnItemFk?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Price
	 */
	Price: number;
}
