/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { CommonBillingSchemaDataService, ICommonBillingSchemaEntity } from '@libs/basics/shared';

/**
 * Quote billing schema data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteBillingSchemaDataService extends CommonBillingSchemaDataService<ICommonBillingSchemaEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const quoteDataService = inject(ProcurementQuoteHeaderDataService);
		const qualifier = 'procurement.quote.billingschmema';
		super(quoteDataService, qualifier);
	}

	protected override provideLoadPayload(): object {
		const quote = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: quote.Id,
			qualifier: this.qualifier
		};
	}

	protected override getParentBillingSchemaId(quote: IQuoteHeaderEntity): number {
		return quote.BillingSchemaFk!;
	}

	protected getRubricCategory(quote: IQuoteHeaderEntity): number {
		return quote.RubricCategoryFk!;
	}

	public getExchangeRate(quote: IQuoteHeaderEntity): number {
		return quote.ExchangeRate;
	}

	protected async doRecalculateBillingSchema(): Promise<ICommonBillingSchemaEntity[]> {
		const headerEntity = this.parentService.getSelectedEntity();

		if (headerEntity) {
			return this.http.get<ICommonBillingSchemaEntity[]>('procurement/quote/billingschema/Recalculate', { params: { headerFk: headerEntity.Id } });
		}

		throw new Error('Main entity is not selected');
	}
}
