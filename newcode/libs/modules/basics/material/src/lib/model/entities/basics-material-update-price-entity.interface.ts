/*
 * Copyright(c) RIB Software GmbH
 */
export interface IBasicsMaterialQtnCon2PrcItemEntity {
	Id: number;
	Selected: boolean;
	TypeName?: string;
	Code?: string;
	BasUomFk?: number;
	PriceListFk?: number;
	UnitRate: number;
	Variance?: number;
	BasCurrencyFk?: number;
	PriceUnit?: string;
	BasUomPriceUnitFk?: number;
	BusinessPartnerFk?: number;
	Weighting?: number;
	DateAsked?: Date;
	MdcMaterialFk: number;
	Children: IBasicsMaterialQtnCon2PrcItemEntity[];
}

export interface IBasicsMaterialUpdateMaterialPriceParamEntity {
	catalogId?: number | null;
	quoteStatusFks?: number[] | null;
	isCheckQuote?: boolean;
	isCheckContract?: boolean;
	contractStatusFks?: number[] | null;
	priceVersionFk?: number | null;
	businessPartnerId?: number | null;
	quoteStartDate?: Date | null;
	quoteEndDate?: Date | null;
	contractStartDate?: Date | null;
	contractEndDate?: Date | null;
	projectId?: number | null;
}

export interface IBasicsMaterialUpdatePriceParam {
	priceResultSet: IBasicsMaterialQtnCon2PrcItemEntity[];
	priceForm: IBasicsMaterialUpdateMaterialPriceParamEntity;
}

export interface IUpdatePriceDataComplete {
	basicOption: number;
	updatePriceParam: IBasicsMaterialUpdatePriceParam;
}
