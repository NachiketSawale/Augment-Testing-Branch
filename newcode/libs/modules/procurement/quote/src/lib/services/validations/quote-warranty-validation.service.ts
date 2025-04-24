/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcWarrantyEntity, ProcurementCommonWarrantyValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { ProcurementQuoteWarrantyDataService } from '../quote-warranty-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';

/**
 * Contract warranty validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteWarrantyValidationService extends ProcurementCommonWarrantyValidationService<IPrcWarrantyEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		const dataService = inject(ProcurementQuoteWarrantyDataService);
		super(dataService);
	}

}