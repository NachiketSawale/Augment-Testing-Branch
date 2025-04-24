/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcGeneralsEntity, ProcurementCommonGeneralsValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteGeneralsDataService } from './quote-generals-data.service';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';


/**
 * Generals validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteGeneralsValidationService extends ProcurementCommonGeneralsValidationService<IPrcGeneralsEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	public constructor() {
		const dataService = inject(ProcurementQuoteGeneralsDataService);
		super(dataService);
	}
}