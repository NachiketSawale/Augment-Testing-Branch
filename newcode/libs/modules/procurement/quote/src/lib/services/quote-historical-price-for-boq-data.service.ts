/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForBoqDataService } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * Represents the data service to handle quote historical price for boq.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteHistoricalPriceForBoqDataService extends BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	public constructor() {
		const quoteHeaderService = inject(ProcurementQuoteHeaderDataService);
		//TODO: Boq not is done yet, replace the parentService after Boq is done.
		super(quoteHeaderService, quoteHeaderService);
	}
}
