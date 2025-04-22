/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICompareExchangeRate } from '../model/entities/compare-exchange-rate.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonCompareExchangeRateService {
	private exchangeRates: ICompareExchangeRate[] = [];

	private getExchangeRateItem(rfqHeaderId: number, qtnHeaderId: number, quoteKey: string) {
		return this.exchangeRates.find(item => {
			return item.RfqHeaderId === rfqHeaderId && (item.QtnHeaderId === qtnHeaderId || item.QuoteKey === quoteKey);
		});
	}

	public setExchangeRate(rfqHeaderId: number, qtnHeaderId: number, quoteKey: string, curExchangeRate: number, curCurrencyFk: number) {
		const exchangeCache = this.getExchangeRateItem(rfqHeaderId, qtnHeaderId, quoteKey);

		if (exchangeCache) {
			exchangeCache.ExchangeRate = curExchangeRate;
			if (curCurrencyFk) {
				exchangeCache.CurrencyFk = curCurrencyFk;
			}
		} else {
			this.exchangeRates.push({
				RfqHeaderId: rfqHeaderId,
				QtnHeaderId: qtnHeaderId,
				QuoteKey: quoteKey,
				ExchangeRate: curExchangeRate,
				CurrencyFk: curCurrencyFk
			});
		}
	}

	public getExchangeRate(rfqHeaderId: number, qtnHeaderId: number, quoteKey: string) {
		const exchangeCache = this.getExchangeRateItem(rfqHeaderId, qtnHeaderId, quoteKey);
		return exchangeCache ? exchangeCache.ExchangeRate : 1;
	}

	public getCurrencyFk(rfqHeaderId: number, qtnHeaderId: number, quoteKey: string) {
		const exchangeCache = this.getExchangeRateItem(rfqHeaderId, qtnHeaderId, quoteKey);
		return exchangeCache ? exchangeCache.CurrencyFk : null;
	}
}