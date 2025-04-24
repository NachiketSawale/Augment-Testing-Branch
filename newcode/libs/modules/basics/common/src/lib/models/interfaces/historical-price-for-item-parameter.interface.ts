/*
 * Copyright(c) RIB Software GmbH
 */
export interface IBasicsHistoricalPriceForItemParam {
	HeaderExchangeRate?:number;
	headerCurrencyId?:number;
	headerProjectId?:number;
	matPriceListId?:number | null;
	materialId?:number;
	materialType?:number | null;
	prcItemIds?:number[];
	catalogId?: number | null,
	queryFromQuotation?: boolean,
	queryFromContract?: boolean,
	queryFromMaterialCatalog?: boolean,
	queryNeutralMaterial?: boolean,
	priceVersionFk?: number | null,
	startDate?: Date,
	endDate?: Date,
	materialIds?: number[],
	businessPartnerId?: number | null,
	itemValue?:string|null,
	priceRange?:string|null,
}

export interface IBasicsHistoricalPriceForItemParentData {
	Id: number;
	CurrencyFk?: number;
	BasCurrencyFk?: number;
	ProjectFk?: number;
	ExchangeRate?: number;
}