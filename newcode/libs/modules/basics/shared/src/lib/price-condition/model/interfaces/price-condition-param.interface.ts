/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Price Condition reload param
 */
export interface IPriceConditionReloadParam {
	priceConditionId: number | null;
	isFromMaterial?: boolean;
	isCopyFromPrcItem?: boolean;
	materialPriceListId?: number;
	isCopyPriceConditionFromBoqDivision?: boolean;
	basicPrcItemId?: number;
}