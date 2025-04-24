/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IPrcDocumentEntity, ProcurementCommonDocumentDataService } from '@libs/procurement/common';
import { ProcurementQuoteRequisitionDataService } from './quote-requisitions-data.service';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteRfqDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {
	
    public constructor() {
		const quoteRequisitionDataService = inject(ProcurementQuoteRequisitionDataService);
		super(quoteRequisitionDataService, {});
	}
}
