/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IQuoteItemEntity, QuoteItemComplete } from '@libs/procurement/quote';
import { BasicsSharedBillingSchemaBehaviorService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementPriceComparisonBillingSchemaDataService } from '../services/billing-schema-data.service';

/**
 * Procurement price comparison billing schema behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonBillingSchemaBehavior extends BasicsSharedBillingSchemaBehaviorService<ICommonBillingSchemaEntity, IQuoteItemEntity, QuoteItemComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProcurementPriceComparisonBillingSchemaDataService));
	}
}