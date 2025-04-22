/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '../model/entities';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractPaymentScheduleDataService } from './procurement-contract-payment-schedule-data.service';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleValidationService } from '@libs/procurement/common';

/**
 * Procurement contract payment schedule validation service token
 */
export const PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_VALIDATION_TOKEN = new InjectionToken<ProcurementContractPaymentScheduleValidationService>('ProcurementContractPaymentScheduleValidationService');

/**
 * Procurement contract payment schedule validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPaymentScheduleValidationService extends ProcurementCommonPaymentScheduleValidationService<IPrcPaymentScheduleEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const dataService = inject(ProcurementContractPaymentScheduleDataService);
		super(dataService);
	}
}