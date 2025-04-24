/*
 * Copyright(c) RIB Software GmbH
 */

export interface IOriginPriceExcludeTarget {
	QuoteKey: string,
	BoqItemId?: number,
	PrcItemId?: number,
	Price: number,
	NotSubmitted: boolean
}