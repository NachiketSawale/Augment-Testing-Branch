/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForBoqDataService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

/**
 * Represents the data service to handle package historical price for boq.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionHistoricalPriceForBoqDataService extends BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	public constructor() {
		const packageHeaderService = inject(ProcurementRequisitionHeaderDataService);
		// TODO: The BoQ isn't finished yet. Replace the parentService once the BoQ is completed.
		super(packageHeaderService, packageHeaderService);
	}
}
