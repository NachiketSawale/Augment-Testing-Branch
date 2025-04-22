/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ProcurementCommonOverallDiscountService } from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

/**
 * Procurement Requisition Overall Discount Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionOverallDiscountService extends ProcurementCommonOverallDiscountService<IReqHeaderEntity> {
	private readonly headerService: ProcurementRequisitionHeaderDataService;

	protected constructor() {
		const reqHeaderService = inject(ProcurementRequisitionHeaderDataService);
		super(reqHeaderService);
		this.headerService = reqHeaderService;
	}

	protected override getPrcHeaderFks(): number[] {
		const headerContext = this.headerService.getHeaderContext();
		return [headerContext.prcHeaderFk];
	}
}