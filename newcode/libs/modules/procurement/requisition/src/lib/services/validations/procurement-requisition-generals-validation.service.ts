/*
 * Copyright(c) RIB Software GmbH
 */
import { IPrcGeneralsEntity, ProcurementCommonGeneralsValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementRequisitionGeneralsDataService } from '../procurement-requisition-generals-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';

/**
 * Requisition Generals validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionGeneralsValidationService extends ProcurementCommonGeneralsValidationService<IPrcGeneralsEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {

    public constructor() {
        const dataService = inject(ProcurementRequisitionGeneralsDataService);
        super(dataService);
    }
}