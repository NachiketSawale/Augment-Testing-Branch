/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICompareExchangeRate {
	RfqHeaderId: number,
	QtnHeaderId: number,
	QuoteKey: string,
	ExchangeRate: number,
	CurrencyFk: number
}