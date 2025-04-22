/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ProcurementRfqSuggestBidderDataService } from '../services/rfq-suggest-bidders-data.service';
import {
	ProcurementCommonSuggestBiddersBehaviorService
} from '@libs/procurement/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';

export const PROCUREMENT_RFQ_SUGGEST_BIDDER_BEHAVIOR_TOKEN = new InjectionToken<ProcurementRfqSuggestBidderDataService>('ProcurementRfqSuggestBidderBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqSuggestBidderBehavior extends ProcurementCommonSuggestBiddersBehaviorService<IPrcSuggestedBidderEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	public constructor() {
		super(inject(ProcurementRfqSuggestBidderDataService));
	}

}