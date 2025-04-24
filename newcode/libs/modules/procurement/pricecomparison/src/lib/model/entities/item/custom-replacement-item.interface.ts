/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICustomReplacementItem {
	/**
	 * DateRequired
	 */
	DateRequired?: string | null;

	/**
	 * Description1
	 */
	Description1?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * ItemNo
	 */
	ItemNo?: string | null;

	/**
	 * LineType
	 */
	LineType: number;

	/**
	 * PackageFk
	 */
	PackageFk?: number | null;

	/**
	 * PrcHeaderId
	 */
	PrcHeaderId: number;

	/**
	 * Price
	 */
	Price: number;

	/**
	 * PriceExtra
	 */
	PriceExtra: number;

	/**
	 * PriceExtraOc
	 */
	PriceExtraOc: number;

	/**
	 * PriceOc
	 */
	PriceOc: number;

	/**
	 * PriceUnit
	 */
	PriceUnit: number;

	/**
	 * Quantity
	 */
	Quantity: number;

	/**
	 * StructureFk
	 */
	StructureFk?: number | null;

	/**
	 * TargetPrice
	 */
	TargetPrice: number;

	/**
	 * TargetTotal
	 */
	TargetTotal: number;

	/**
	 * Total
	 */
	Total: number;

	/**
	 * TotalPrice
	 */
	TotalPrice: number;

	/**
	 * UomPriceUnitFk
	 */
	UomPriceUnitFk?: number | null;
}
