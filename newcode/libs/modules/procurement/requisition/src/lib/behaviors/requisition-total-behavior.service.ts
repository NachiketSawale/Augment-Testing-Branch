import { inject, Injectable, InjectionToken } from '@angular/core';
import {  ProcurementCommonTotalBehavior } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { RequisitionTotalDataService } from '../services/requisition-total-data.service';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

export const PROCUREMENT_REQUISITION_TOTAL_BEHAVIOR_TOKEN = new InjectionToken<RequisitionTotalBehavior>('requisitionTotalBehavior');

@Injectable({
	providedIn: 'root',
})
export class RequisitionTotalBehavior extends ProcurementCommonTotalBehavior<IPrcCommonTotalEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		super(inject(RequisitionTotalDataService));
	}
}
