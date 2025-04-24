/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Procurement PrcItem and PesItem common calculation entity interface
 */
export interface IPrcCommonItemCalculateEntity {
	Quantity: number;
	Price: number;
	PriceOc: number;
	PriceGross: number;
	PriceGrossOc: number;
	TotalPrice: number;
	TotalPriceOc: number;
	TotalPriceGross: number;
	TotalPriceGrossOc: number;
	Total: number;
	TotalOc: number;
	TotalGross: number;
	TotalGrossOc: number;
	PriceExtra: number;
	PriceExtraOc: number;
	DiscountSplit: number;
	DiscountSplitOc: number;
	DiscountAbsolute: number;
	DiscountAbsoluteOc: number;
	DiscountAbsoluteGross: number;
	DiscountAbsoluteGrossOc: number;
	Discount: number;
}