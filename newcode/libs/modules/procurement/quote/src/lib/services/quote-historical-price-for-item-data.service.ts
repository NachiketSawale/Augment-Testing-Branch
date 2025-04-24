/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BasicsSharedHistoricalPriceForItemDataService
} from '@libs/basics/shared';
import { ProcurementQuoteItemDataService } from './procurement-quote-item-data.service';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';
/**
 * Represents the data service to handle rfq requisition field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IQuoteItemEntity, QuoteItemComplete> {

	private readonly procurementQuoteHeaderDataService;
	public constructor(protected procurementQuoteItemDataService: ProcurementQuoteItemDataService) {
		const quoteHeaderService = inject(ProcurementQuoteHeaderDataService);
		super(procurementQuoteItemDataService, quoteHeaderService);
		this.procurementQuoteHeaderDataService = quoteHeaderService;
	}
}
