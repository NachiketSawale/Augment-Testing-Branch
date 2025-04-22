/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonChangePaymentScheduleStatusWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { ProcurementRequisitionPaymentScheduleDataService } from '../services/procurement-requisition-payment-schedule-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Requisition change payment schedule status wizard service
 */
export class ProcurementRequisitionChangePaymentScheduleStatusWizardService extends ProcurementCommonChangePaymentScheduleStatusWizardService<IPrcPaymentScheduleEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	
	public constructor( mainService:ProcurementRequisitionHeaderDataService, dataService:ProcurementRequisitionPaymentScheduleDataService){
		super(mainService, dataService);
	}
}
