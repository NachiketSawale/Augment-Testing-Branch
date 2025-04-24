/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleValidationService } from '@libs/procurement/common';
import { ProcurementRequisitionPaymentScheduleDataService } from '../procurement-requisition-payment-schedule-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';

/**
 * Procurement requisition payment schedule validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionPaymentScheduleValidationService extends ProcurementCommonPaymentScheduleValidationService<IPrcPaymentScheduleEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const dataService = inject(ProcurementRequisitionPaymentScheduleDataService);
		super(dataService);
	}
}
