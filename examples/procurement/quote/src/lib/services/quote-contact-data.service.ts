/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcContactEntity, ProcurementCommonContactDataService } from '@libs/procurement/common';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Contact data service
 */
export class ProcurementQuoteContactDataService extends ProcurementCommonContactDataService<IPrcContactEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		const quoteDataService = inject(ProcurementQuoteHeaderDataService);
		super(quoteDataService, {});
	}

	public getSelectedParentEntity() {
		const parentItem = this.parentService.getSelectedEntity();
		return {
			BusinessPartnerFk: parentItem?.BusinessPartnerFk,
			BusinessPartner2Fk: undefined,
		};
	}

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IPrcContactEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
