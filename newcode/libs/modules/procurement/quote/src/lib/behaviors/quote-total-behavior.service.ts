/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ProcurementQuoteTotalDataService } from '../services/quote-total-data.service';
import { ProcurementCommonTotalBehavior } from '@libs/procurement/common';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

export const PROCUREMENT_QUOTE_TOTAL_BEHAVIOR_TOKEN = new InjectionToken<ProcurementQuoteTotalBehavior>('ProcurementQuoteTotalBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteTotalBehavior extends ProcurementCommonTotalBehavior<IPrcCommonTotalEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		super(inject(ProcurementQuoteTotalDataService));
	}
}