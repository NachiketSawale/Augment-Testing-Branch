/*
 * Copyright(c) RIB Software GmbH
 */
export interface IBasicsSharedHistoricalPriceForItemParam {
	HeaderExchangeRate?: number | null;
	headerCurrencyId?: number;
	headerProjectId?: number;
	matPriceListId?: number | null;
	materialId?: number;
	materialType?: number | null;
	prcItemIds?: number[];
	catalogId?: number | null,
	queryFromQuotation: boolean,
	queryFromContract: boolean,
	queryFromMaterialCatalog?: boolean,
	queryNeutralMaterial?: boolean,
	priceVersionFk?: number | null,
	startDate?: Date,
	endDate?: Date,
	materialIds?: number[],
	businessPartnerId?: number | null,
	itemValue?: string | null,
	priceRange?: string | null,
	priceCondition?: number | null,
	projectId?: number | null,
}

export interface IBasicsSharedHistoricalPriceForBoqParam {
	boqItemId?: number | null
	queryFromQuotation: boolean,
	queryFromContract: boolean,
	startDate: Date,
	endDate: Date,
	filter: string
}

export interface IBasicsSharedHistoricalPriceForItemParentData {
	Id: number;
	CurrencyFk?: number;
	BasCurrencyFk?: number;
	ProjectFk?: number;
	ExchangeRate?: number;
	MdcMaterialFk?:number;
}