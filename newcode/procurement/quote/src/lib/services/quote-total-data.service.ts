/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { ProcurementCommonTotalDataService } from '@libs/procurement/common';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Represents the data service to handle quote total field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteTotalDataService extends ProcurementCommonTotalDataService<IPrcCommonTotalEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	private readonly quoteHeaderDataService: ProcurementQuoteHeaderDataService;
	protected internalModuleName = ProcurementInternalModule.Quote;
	public constructor() {
		const quoteHeaderDataService = inject(ProcurementQuoteHeaderDataService);

		super(quoteHeaderDataService, {
			apiUrl: 'procurement/quote/total'
		});

		this.quoteHeaderDataService = quoteHeaderDataService;

		quoteHeaderDataService.RootDataCreated$.subscribe((resp) => {

		});
	}
	public getExchangeRate(): number {
		//TODO: get exchangeRate from prcHeader
		return 1;
	}
}
