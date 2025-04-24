/*
 * Copyright(c) RIB Software GmbH
 */

export interface IExchangeRateLookupEntity {
	Id: number;
	CommentText: string;
	CurrencyConversionFk?: number;
	CurrencyForeignFk?: number;
	CurrencyHomeFk?: number;
	CurrencyRateTypeFk?: number;
	Rate: number;
	RateDate: Date;
	ProjectNo: string;
}