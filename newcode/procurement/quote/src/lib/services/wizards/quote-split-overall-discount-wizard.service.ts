/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteItemComplete } from '../../model/entities/quote-item-entity-complete.class';
import { ProcurementCommonSplitOverallDiscountWizardService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteSplitOverallDiscountWizardService extends ProcurementCommonSplitOverallDiscountWizardService<IQuoteHeaderEntity, QuoteItemComplete> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementQuoteHeaderDataService),
			apiUrl: 'procurement/contract/header/splitoveralldiscount',
		});
	}
}
