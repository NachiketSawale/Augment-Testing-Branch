/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonCallOffAgreementValidationService } from '@libs/procurement/common';
import { IProcurementQuoteCallOffAgreementEntity } from '../../model/entities/quote-call-off-agreement-entity.interface';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteCallOffAgreementDataService } from '../quote-contract-call-off-data.service';
import { inject, Injectable } from '@angular/core';

/**
 * Account CallOffAgreement validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteCallOffAgreementValidationService extends ProcurementCommonCallOffAgreementValidationService<IProcurementQuoteCallOffAgreementEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		const dataService = inject(ProcurementQuoteCallOffAgreementDataService);
		super(dataService);
	}
}
