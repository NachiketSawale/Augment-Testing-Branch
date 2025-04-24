/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
	IPrcItemPriceConditionEntity,
	ProcurementCommonPriceConditionDataService
} from '@libs/procurement/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';

export const PROCUREMENT_QUOTE_PRICE_CONDITION_BEHAVIOR_TOKEN = new InjectionToken<ProcurementQuotePriceConditionBehavior>('ProcurementQuotePriceConditionBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuotePriceConditionBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrcItemPriceConditionEntity>, IPrcItemPriceConditionEntity> {
	public constructor(public readonly dataService: ProcurementCommonPriceConditionDataService<IQuoteItemEntity, QuoteItemComplete>) {
	}

	public onCreate(containerLink: IGridContainerLink<IPrcItemPriceConditionEntity>) {

	}
}