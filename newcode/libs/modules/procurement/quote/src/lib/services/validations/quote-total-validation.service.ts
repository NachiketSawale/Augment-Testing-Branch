/*
 * Copyright(c) RIB Software GmbH
 */

import {  ProcurementCommonTotalValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { ProcurementQuoteTotalDataService } from '../quote-total-data.service';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Quote total validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteTotalValidationService extends ProcurementCommonTotalValidationService<IPrcCommonTotalEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	public constructor() {
		const dataService = inject(ProcurementQuoteTotalDataService);

		super(dataService);
	}

}