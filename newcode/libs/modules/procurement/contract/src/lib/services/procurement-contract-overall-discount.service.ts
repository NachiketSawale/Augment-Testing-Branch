/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementCommonOverallDiscountService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';

/**
 * Procurement Contract Overall Discount Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractOverallDiscountService extends ProcurementCommonOverallDiscountService<IConHeaderEntity> {
	private headerService: ProcurementContractHeaderDataService;

	protected constructor() {
		const contractHeaderService = inject(ProcurementContractHeaderDataService);
		super(contractHeaderService);
		this.headerService = contractHeaderService;
	}

	protected override getPrcHeaderFks(): number[] {
		const headerContext = this.headerService.getHeaderContext();
		return [headerContext.prcHeaderFk];
	}
}