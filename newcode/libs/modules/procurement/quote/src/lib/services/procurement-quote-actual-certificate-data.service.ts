/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProcurementCommonActualCertificateDataService } from '@libs/procurement/common';
import { IQuoteHeaderEntity, QuoteHeaderEntityComplete } from '../model';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteActualCertificateDataService extends ProcurementCommonActualCertificateDataService<IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor(protected quoteDataService: ProcurementQuoteHeaderDataService) {
		super(quoteDataService, {
			readPoint: 'listtoquote',
			createPoint: 'createtoquote'
		});
	}
}