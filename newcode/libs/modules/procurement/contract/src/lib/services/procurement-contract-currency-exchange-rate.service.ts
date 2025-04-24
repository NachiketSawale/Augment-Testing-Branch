/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonCurrencyExchangeRateService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';

/**
 * Procurement contract currencyFk and exchangeRate service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCurrencyExchangeRateService extends ProcurementCommonCurrencyExchangeRateService<IConHeaderEntity, ContractComplete> {

	/**
	 * The constructor
	 * @protected
	 */
	protected constructor() {
		const dataService = inject(ProcurementContractHeaderDataService);
		const updateExchangeRateUrl = 'procurement/contract/header/updateExchangeRate';
		super(dataService, updateExchangeRateUrl);
	}
}