/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedSatusHistoryDataService, IStatusHistoryEntity } from '@libs/basics/shared';
import { IReqHeaderEntity } from '@libs/procurement/common';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

/**
 * Represents the Data service to handle Procurement Requisition Status History Data Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionStatusHistoryDataService extends BasicsSharedSatusHistoryDataService<IStatusHistoryEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor( public reqHeaderService:ProcurementRequisitionHeaderDataService) {
		super(reqHeaderService);
	}
	protected getModuleName(): string {
        return 'requisition';
    }
}