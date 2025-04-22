import { ProcurementCommonSuggestBiddersBehaviorService } from '@libs/procurement/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { RequisitionSuggestedBidderDataService } from '../services/requisition-suggested-bidder-data.service';

export const PROCUREMENT_REQ_SUGGEST_BIDDER_BEHAVIOR_TOKEN = new InjectionToken<RequisitionSuggestedBidderDataService>('requisitionSuggestedBidderDataService');

@Injectable({
	providedIn: 'root',
})
export class ReqSuggestedBidderBehavior extends ProcurementCommonSuggestBiddersBehaviorService<IPrcSuggestedBidderEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		super(inject(RequisitionSuggestedBidderDataService));
	}
}
