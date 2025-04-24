/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ProcurementCommonCurrencyExchangeRateService } from '@libs/procurement/common';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';

/**
 * Procurement package currencyFk and exchangeRate service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageCurrencyExchangeRateService extends ProcurementCommonCurrencyExchangeRateService<IPrcPackageEntity, PrcPackageCompleteEntity> {

	/**
	 * The constructor
	 * @protected
	 */
	protected constructor() {
		const dataService = inject(ProcurementPackageHeaderDataService);
		const updateExchangeRateUrl = 'procurement/contract/header/updateExchangeRate';
		super(dataService, updateExchangeRateUrl);
	}
}