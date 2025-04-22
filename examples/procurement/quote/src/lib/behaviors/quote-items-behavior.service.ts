/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IGridContainerLink } from '@libs/ui/business-base';
import {
	PrcCommonItemComplete,
	IPrcItemEntity,
	ProcurementCommonItemBehavior
} from '@libs/procurement/common';
import { ProcurementQuoteItemDataService } from '../services/procurement-quote-item-data.service';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';

export const PROCUREMENT_QUOTE_ITEM_BEHAVIOR_TOKEN = new InjectionToken<ProcurementQuoteItemBehavior>('procurementQuoteItemBehavior');

/**
 * Procurement Quote item behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteItemBehavior extends ProcurementCommonItemBehavior<IPrcItemEntity, PrcCommonItemComplete, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {

	/**
	 * The constructor
	 */
	public constructor(private readonly quoteItemDataService: ProcurementQuoteItemDataService) {
		super(quoteItemDataService);
	}

	public override onCreate(containerLink: IGridContainerLink<IPrcItemEntity>) {
		super.onCreate(containerLink);
	}
}