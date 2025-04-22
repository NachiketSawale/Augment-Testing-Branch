/*
 * Copyright(c) RIB Software GmbH
 */

import {  IPrcWarrantyEntity, ProcurementCommonWarrantyValidationService } from '@libs/procurement/common';
import { Injectable } from '@angular/core';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionWarrantyDataService } from '../procurement-requisition-warranty-data.service';

/**
 * Requisition warranty validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionWarrantyValidationService extends ProcurementCommonWarrantyValidationService<IPrcWarrantyEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected readonly parentService:ProcurementRequisitionWarrantyDataService) {
		super(parentService);
	}

}