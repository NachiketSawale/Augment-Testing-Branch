/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonCurrencyExchangeRateService } from '@libs/procurement/common';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * Procurement contract currencyFk and exchangeRate service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesCurrencyExchangeRateService extends ProcurementCommonCurrencyExchangeRateService<IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 * @protected
	 */
	protected constructor() {
		const dataService = inject(ProcurementPesHeaderDataService);
		const updateExchangeRateUrl = 'procurement/pes/header/updateExchangeRate';
		super(dataService, updateExchangeRateUrl);
	}
}
