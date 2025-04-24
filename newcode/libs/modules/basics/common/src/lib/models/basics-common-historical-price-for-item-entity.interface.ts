/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityIdentification } from '@libs/platform/common';
import { ItemTypeForHistoricalPriceEnum } from './enum/item-type-for-historical-price.enum';
/**
 * Historical entity interface
 */
export interface IBasicsCommonHistoricalPriceForItemEntity extends IEntityIdentification{
	Index:string;
	PId?:number;
	MaterialId?:number;
	Selected:boolean;
	ItemCodeAndDesc:string;
	SourceType:string;
	CalatlogType:string;
	CatalogId?:number;
	Type:ItemTypeForHistoricalPriceEnum;
	SourceCodeAndDesc:string;
	UnitRate:number;
	CurrencyId?:number;
	ProjectId?:number;
	ConvertedUnitRate?:number;
	Variance?:number;
	VarianceFormatter?:number;
	PriceUnit:number;
	MaterialPriceListId?:number;
	UomId:number;
	Weighting:number;
	BusinessPartnerId?:number;
	Date?:Date;
	Children:Array<IBasicsCommonHistoricalPriceForItemEntity>;
	Co2Source?:number;
	Co2Project?:number;
}