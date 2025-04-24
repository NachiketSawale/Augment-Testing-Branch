/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { BasicsSharedBillingSchemaBehaviorService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementQuoteBillingSchemaDataService } from '../services/quote-billing-schema-data.service';

/**
 * Procurement contract billing schema behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteBillingSchemaBehavior extends BasicsSharedBillingSchemaBehaviorService<ICommonBillingSchemaEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementQuoteBillingSchemaDataService));
	}
}