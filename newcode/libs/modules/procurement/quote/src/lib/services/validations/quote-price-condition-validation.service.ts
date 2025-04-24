/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonPriceConditionValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IQuoteItemEntity } from '../../model/entities/quote-item-entity.interface';
import { ProcurementQuotePriceConditionDataService } from '../../services/procurement-quote-price-condition-data.service';
import { QuoteItemComplete } from '../../model/entities/quote-item-entity-complete.class';


/**
 * Contract Price Condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuotePriceConditionValidationService extends ProcurementCommonPriceConditionValidationService<IQuoteItemEntity, QuoteItemComplete> {
	public constructor() {
		const dataService = inject(ProcurementQuotePriceConditionDataService);
		super(dataService);
	}
}