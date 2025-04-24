/*
 * Copyright(c) RIB Software GmbH
 */

import {InjectionToken} from '@angular/core';

/**
 * Price list returns from material search http with material
 */
export interface IMaterialSearchPriceList {
	Id: number;
	Cost: number;
	PriceForShow: number;
	EstimatePrice: number;
	PriceReferenceForShow: number;
	PrcPriceConditionFk: number | null;
	LeadTime: number;
	MinQuantity: number;
	SellUnit: number;
	PriceExtras: number;
	TaxCodeFk?: number;
	RetailPrice: number;
	ListPrice: number;
	Discount: number;
	Charges: number;
	Co2Project?: number;
	Co2Source?: number;
	CurrencyFk?: number;
	BasCo2SourceFk?: number;
	MaterialPriceVersionFk?: number;
	DayworkRate: number;
}

/**
 * injection token of price list
 */
export const MATERIAL_SEARCH_PRICELIST = new InjectionToken<IMaterialSearchPriceList[]>('MATERIAL_SEARCH_PRICELIST');