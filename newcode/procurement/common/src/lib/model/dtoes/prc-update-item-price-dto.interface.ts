/*
 * Copyright(c) RIB Software GmbH
 */

export interface IProcurementCommonHistoricalPriceForItemDto {
	Index: string,
	Id: number;
	Selected: boolean;
	ItemCodeAndDesc: string;
	SourceType: string;
	CalatlogType: string | null;
	SourceCodeAndDesc: string;
	BusinessPartnerId?: number;
	UnitRate: number;
	Variance?: number;
	CurrencyId?: number | null,
	PriceUnit?: number;
	MaterialId?: number | null;
	MaterialPriceListId?: number | null;
	Weighting: number;
	ProjectId?: number;
	PId?: number | null;
	CatalogId?: number | null;
	Co2Project?: string | null;
	Co2Source?: string | null;
	ConvertedUnitRate?: number | null;
	Date?: Date;
	Children?: IProcurementCommonHistoricalPriceForItemDto[] | null;
}