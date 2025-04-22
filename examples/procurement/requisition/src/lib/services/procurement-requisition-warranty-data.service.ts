/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcWarrantyEntity, ProcurementCommonWarrantyDataService} from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
/**
 * Warranty service in Requisition
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionWarrantyDataService extends ProcurementCommonWarrantyDataService<IPrcWarrantyEntity,IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected override readonly parentService:ProcurementRequisitionHeaderDataService) {
		super(parentService);
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcWarrantyEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}