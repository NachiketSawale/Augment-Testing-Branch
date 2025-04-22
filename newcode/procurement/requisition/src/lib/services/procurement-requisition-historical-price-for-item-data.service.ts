/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForItemDataService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { RequisitionItemsDataService } from './requisition-items-data.service';

/**
 * HistoricalPriceForItem service in Requisition
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
    
	public constructor() {
		const parentService = inject(RequisitionItemsDataService);
		const headerService = inject(ProcurementRequisitionHeaderDataService);
		super(parentService, headerService);
	}
}