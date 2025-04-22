/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import {
	ProcurementCommonPriceConditionDataService
} from '@libs/procurement/common';
import {IPriceConditionContext} from '@libs/basics/shared';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';
import { ProcurementQuoteItemDataService } from './procurement-quote-item-data.service';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';


export const PROCUREMENT_QUOTE_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<ProcurementQuotePriceConditionDataService>('procurementQuotePriceConditionDataService');


/**
 * The PrcItem PriceCondition service in quote
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuotePriceConditionDataService extends ProcurementCommonPriceConditionDataService<IQuoteItemEntity, QuoteItemComplete> {
	protected internalModuleName = 'procurement.quote';
	private readonly quoteHeaderService = inject(ProcurementQuoteHeaderDataService);
	/**
	 * The constructor
	 */
	public constructor(protected itemService: ProcurementQuoteItemDataService) {
		super(itemService);
	}

	public getContextFromParent(): IPriceConditionContext {
		const quoteHeader = this.quoteHeaderService.getSelectedEntity()!;
		let headerId = -1;
		let projectId = -1;
		let prcPriceConditionId: number | null = -1;
		let exchangeRate = 1;
		if (this.itemService.getSelection().length > 0) {
			const parentItem = this.itemService.getSelectedEntity()!;
			headerId = quoteHeader.Id;
			prcPriceConditionId = parentItem.PrcPriceConditionFk ?? null;
			exchangeRate = quoteHeader.ExchangeRate;
			if (quoteHeader.ProjectFk) {
				projectId = quoteHeader.ProjectFk;
			}
		}
		return {
			PrcPriceConditionId: prcPriceConditionId,
			HeaderId: headerId,
			HeaderName: this.internalModuleName,
			ProjectFk: projectId,
			ExchangeRate: exchangeRate
		};
	}
}