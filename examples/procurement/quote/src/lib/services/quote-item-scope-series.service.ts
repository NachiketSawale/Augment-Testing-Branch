/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PrcItemScopeEntitySeriesService } from '@libs/procurement/common';
import { ProcurementQuoteItemDataService } from './procurement-quote-item-data.service';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';

/**
 * Quote item scope container data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteItemScopeSeriesService extends PrcItemScopeEntitySeriesService<IQuoteItemEntity, QuoteItemComplete, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {
	public constructor() {
		super({
			prcItemDataService: inject(ProcurementQuoteItemDataService)
		});
	}
}