/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IPrcPaymentScheduleEntity, ProcurementCommonChangePaymentScheduleStatusWizardService } from '@libs/procurement/common';
import { ProcurementContractPaymentScheduleDataService } from '../services/procurement-contract-payment-schedule-data.service';
import { ContractComplete } from '../model/contract-complete.class';
import { IConHeaderEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root'
})

/**
 * Procurement contract change payment schedule status wizard service
 */
export class ProcurementContractChangePaymentScheduleStatusWizardService extends ProcurementCommonChangePaymentScheduleStatusWizardService<IPrcPaymentScheduleEntity, IConHeaderEntity, ContractComplete> {
	
	public constructor( mainService:ProcurementContractHeaderDataService, dataService:ProcurementContractPaymentScheduleDataService){
		super(mainService, dataService);
	}
}
