/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { ProcurementCommonCallOffAgreementDataService } from '@libs/procurement/common';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { IProcurementQuoteCallOffAgreementEntity } from '../model/entities/quote-call-off-agreement-entity.interface';

/**
 * Quote CallOffAgreement data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteCallOffAgreementDataService extends ProcurementCommonCallOffAgreementDataService<IProcurementQuoteCallOffAgreementEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	public constructor() {
		const quoteHeaderDataService = inject(ProcurementQuoteHeaderDataService);
		super(quoteHeaderDataService);
	}

	protected override provideLoadPayload(): object {
		return {PKey1: this.getSelectedParent()?.Id};
	}

	protected override provideCreatePayload(): object {
		const parentId = this.getSelectedParent()?.Id;
		if (parentId) {
			return {PKey1: parentId};
		}
		throw new Error('Please select a quote first');
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IProcurementQuoteCallOffAgreementEntity): boolean {
		return entity.QtnHeaderFk === parentKey.Id;
	}
}
