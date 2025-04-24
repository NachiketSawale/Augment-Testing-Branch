/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleBehaviorService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementRequisitionPaymentScheduleDataService } from '../services/procurement-requisition-payment-schedule-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

/**
 *
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionPaymentScheduleBehaviorService extends ProcurementCommonPaymentScheduleBehaviorService<IPrcPaymentScheduleEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		const dataService = inject(ProcurementRequisitionPaymentScheduleDataService);
		super(dataService);
	}
}
