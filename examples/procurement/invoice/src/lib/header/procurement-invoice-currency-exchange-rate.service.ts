/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IInvHeaderEntity } from '../model/entities';
import { ProcurementCommonCurrencyExchangeRateService } from '@libs/procurement/common';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from './procurement-invoice-header-data.service';

/**
 * Procurement invoice currencyFk and exchangeRate service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceCurrencyExchangeRateService extends ProcurementCommonCurrencyExchangeRateService<IInvHeaderEntity, InvComplete> {
	/**
	 * The constructor
	 * @protected
	 */
	protected constructor() {
		const dataService = inject(ProcurementInvoiceHeaderDataService);
		const updateExchangeRateUrl = 'procurement/invoice/header/updateExchangeRate';
		super(dataService, updateExchangeRateUrl);
	}
}
