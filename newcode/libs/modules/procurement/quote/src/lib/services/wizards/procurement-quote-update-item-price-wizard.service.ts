/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonUpdateItemPriceWizardService, ProcurementModuleUpdatePriceWizard } from '@libs/procurement/common';
import { ProcurementQuoteItemDataService } from '../procurement-quote-item-data.service';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { IQuoteHeaderEntity, IQuoteItemEntity, QuoteHeaderEntityComplete, QuoteItemComplete } from '../../model';
import { IQuoteRequisitionEntity } from '../../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../../model/entities/quote-quisition-entity-complete.class';

/**
 * Procurement Quote Update Item Price Wizard Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteUpdateItemPriceWizardService extends ProcurementCommonUpdateItemPriceWizardService<IQuoteHeaderEntity, QuoteHeaderEntityComplete, IQuoteItemEntity, QuoteItemComplete, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityQuote',
			rootDataService: inject(ProcurementQuoteHeaderDataService),
			prcItemService: inject(ProcurementQuoteItemDataService) ,
			module: ProcurementModuleUpdatePriceWizard.Quote
		});
	}
}