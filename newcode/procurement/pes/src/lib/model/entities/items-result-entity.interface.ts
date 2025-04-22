/*
 * Copyright(c) RIB Software GmbH
 */

export interface IItemsResultEntity {
	Id: number;
	PrjStockLocationFk?: number;
	ProvisionPercent: number;
	ProvisonTotal: number;
	IsLotManagement: boolean;
	IsInStock2Material: boolean;
}
