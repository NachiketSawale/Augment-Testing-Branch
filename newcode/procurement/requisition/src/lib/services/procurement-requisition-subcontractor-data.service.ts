/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorDataService } from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

/**
 * subcontractor service in Requisition
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionSubcontractorDataService extends ProcurementCommonSubcontractorDataService<IPrcSubreferenceEntity,IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected override readonly parentService:ProcurementRequisitionHeaderDataService) {
		super(parentService);
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcSubreferenceEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}