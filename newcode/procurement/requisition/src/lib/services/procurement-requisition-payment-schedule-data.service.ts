/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementModule } from '@libs/procurement/shared';
import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleDataService } from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

/**
 * Procurement requisition payment schedule data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionPaymentScheduleDataService extends ProcurementCommonPaymentScheduleDataService<IPrcPaymentScheduleEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementRequisitionHeaderDataService);
		const totalSourceUrl = 'procurement/requisition/total';
		super(ProcurementModule.Requisition, totalSourceUrl, parentService, parentService);
	}

	public override isParentMainEntity(parent: IReqHeaderEntity): boolean {
		return !parent.ReqHeaderFk;
	}
	
	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcPaymentScheduleEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
