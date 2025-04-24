/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Material Custom entity interface
 */
export interface IBasicsMaterialCustomEntity{
	CatalogCodeDes: string;
	OptionCode: string;
	OptionCodeId: number;
	ImportType: number;
	IsNewMaterialGroup: number;
	GroupLevel: number;
	Attributes: number;
	Characteristics: number;
	Documents: number;
	ScopeVariant: number;
	ScopeSupply: number;
	SpecifiedPriceListVersion: boolean;
	SkipPreviewAndSimulate: boolean;
	ImportTranslation: boolean;
	IsPriceAfterTax: boolean;
	Translations: string[];
}