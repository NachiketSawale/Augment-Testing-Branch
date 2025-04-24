/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleBehaviorService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { ProcurementContractPaymentScheduleDataService } from '../services/procurement-contract-payment-schedule-data.service';

export const PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractPaymentScheduleBehaviorService>('ProcurementContractPaymentScheduleBehaviorService');

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPaymentScheduleBehaviorService extends ProcurementCommonPaymentScheduleBehaviorService<IPrcPaymentScheduleEntity, IConHeaderEntity, ContractComplete> {
	public constructor() {
		const dataService = inject(ProcurementContractPaymentScheduleDataService);
		super(dataService);
	}

}