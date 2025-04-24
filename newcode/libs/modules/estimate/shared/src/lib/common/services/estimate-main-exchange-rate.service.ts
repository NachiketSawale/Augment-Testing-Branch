/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { find } from 'lodash';

/**
 * defined the type for exchange rate information
 */
export type EstimateExchangeRateInfo = {ForeignCurrencyFk: number, Rate: number|null };

/**
 * provider project exchange rates
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainExchangeRateService{

	private httpClient = inject(HttpClient);
	private platformConfigurationService = inject(PlatformConfigurationService);
	private exchangeRates: EstimateExchangeRateInfo[] = [];

	/**
	 * load exchange rate data by project id
	 * @param projectId
	 * @param reload
	 */
	public loadData(projectId:number, reload?:boolean):Promise<EstimateExchangeRateInfo[]>{
		if(this.exchangeRates && this.exchangeRates.length && !reload){
			return Promise.resolve(this.exchangeRates);
		}else{
			return new Promise((resolve, reject) => {
				this.httpClient.get(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/currencyconversion/getexchangerates?projectId='+ projectId).subscribe({
					next: exchangeRateObj => {
						this.exchangeRates = [];
						for (const [key, value] of Object.entries(exchangeRateObj)) {
							this.exchangeRates.push({ForeignCurrencyFk:parseInt(key), Rate:value});
						}
						resolve(this.exchangeRates);
					},
					error: () => {
						reject();
					}
				});
			});
		}
	}

	/**
	 * get the exchange rate based on the foreign currency ID
	 * @param foreignCurrencyId
	 */
	public getExchRate(foreignCurrencyId: number):number{
		let rate = 1;
		if(foreignCurrencyId){
			const item =  find(this.exchangeRates, {'ForeignCurrencyFk': foreignCurrencyId});
			if(item && item.Rate){
				rate = item.Rate;
			}
		}
		return rate;
	}
}