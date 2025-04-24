/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from './estimate-main-context.service';
import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';
import { IBasicsCurrencyRateEntity } from '@libs/basics/interfaces';
import { ExchangeRateType } from '../enums/exchange-rate-type.enum';
import { lastValueFrom } from 'rxjs';

/**
 * MultiCurrencyCommonService is the master control for setting and getting n-ary currencies.
 * it is migrated from basicsMultiCurrencyCommonService
 */
@Injectable({
	providedIn: 'root',
})
export class MultiCurrencyCommonService{
	private readonly http = inject(HttpClient);
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	
	/**
	 * assign currencyFk and exchangeRate from EstHeader to LineItem
	 * @param lineItem
	 */
	public setCurrencies(lineItem: IEstLineItemEntity){
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		if(estHeader){
			lineItem.Currency1Fk = estHeader.Currency1Fk;
			lineItem.Currency2Fk = estHeader.Currency2Fk;
			lineItem.ExchangeRate1 = estHeader.ExchangeRate1;
			lineItem.ExchangeRate2 = estHeader.ExchangeRate2;
		}
	}

	/**
	 * calculate the costExchangeRate of lineItem
	 * @param item
	 */
	public calculateMultiCurrencies(item: IEstLineItemEntity | IEstResourceEntity){
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		if(estHeader){
			item.CostExchangeRate1 = (estHeader.ExchangeRate1 ?? 1) * item.CostTotal;
			item.CostExchangeRate2 = (estHeader.ExchangeRate2 ?? 1) * item.CostTotal;
			item.ForeignBudget1 = (estHeader.ExchangeRate1 ?? 1) * item.Budget;
			item.ForeignBudget2 = (estHeader.ExchangeRate2 ?? 1) * item.Budget;
		}
	}

	/**
	 * get project currency rates by project id
	 * @param currentProject
	 */
	public getPrjCurrenciesAndRates(currentProject: number) {
		return lastValueFrom(this.http.get<IProjectMainCurrencyRateEntity[]>(this.platformConfigurationService.webApiBaseUrl + 'project/main/currencyrate/listbyproject?projectId=' + currentProject));
	}

	/**
	 * get lasted project currency rate by project id
	 * @param currencyHomeFk
	 * @param currencyForeignFk
	 * @param currencyRateTypeFk
	 */
	public getLatestRate(currencyHomeFk: number, currencyForeignFk: number, currencyRateTypeFk: number){
		return lastValueFrom(this.http.get<IBasicsCurrencyRateEntity>(this.platformConfigurationService.webApiBaseUrl + 'basics/currency/rate/latest?currencyHomeFk='+currencyHomeFk +'&currrencyForeignFk=' +currencyForeignFk+'&currencyRateTypeFk='+currencyRateTypeFk));
	}

	/**
	 * filter exchanges by budget
	 * @param rates
	 * @param currencyForeignFk
	 */
	public filterBudgetRate(rates: IProjectMainCurrencyRateEntity[], currencyForeignFk: number){
		return this.filterRate(rates, ExchangeRateType.budgetRate, currencyForeignFk);
	}

	/**
	 * filter exchanges by project
	 * @param rates
	 * @param currencyForeignFk
	 */
	public filterProjectRate(rates: IProjectMainCurrencyRateEntity[], currencyForeignFk: number){
		return this.filterRate(rates, ExchangeRateType.projectRate, currencyForeignFk);
	}

	/**
	 * filter exchanges by master
	 * @param rates
	 * @param currencyForeignFk
	 */
	public filterExchangeRate(rates: IProjectMainCurrencyRateEntity[], currencyForeignFk: number){
		return this.filterRate(rates, ExchangeRateType.exchangeRate, currencyForeignFk);
	}

	private filterRate(rates: IProjectMainCurrencyRateEntity[], exchangeRateType: ExchangeRateType, currencyForeignFk: number){
		let budget : IProjectMainCurrencyRateEntity | null = null;
		let newDate : Date | undefined;
		let oldDate: Date | undefined;
		rates.forEach(item => {
			if(item.CurrencyRateTypeFk === exchangeRateType && item.CurrencyForeignFk === currencyForeignFk){
				newDate = item.Version ? item.UpdatedAt : item.InsertedAt;
				if(oldDate === undefined || (newDate && newDate > oldDate)){
					oldDate = newDate;
					budget = item;
				}
			}
		});
		return budget;
	}
}