/*
 * Copyright(c) RIB Software GmbH
 */

export interface IItemsResultGenerated {
	/*
	 * IsInStock2Material
	 */
	IsInStock2Material: boolean;

	/*
	 * IsLotManagement
	 */
	IsLotManagement: boolean;

	/*
	 * PrjStockLocationFk
	 */
	PrjStockLocationFk?: number | null;

	/*
	 * ProvisionPercent
	 */
	ProvisionPercent: number;

	/*
	 * ProvisionTotal
	 */
	ProvisionTotal: number;
}
