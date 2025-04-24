/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { CommonBillingSchemaDataService, ICommonBillingSchemaEntity, IReculateUrlParameter } from '@libs/basics/shared';
import { ProcurementPriceComparisonCompareItemDataExtensionService } from './data/item/compare-item-data-extension.service';
import { IQuoteItemEntity, QuoteItemComplete } from '@libs/procurement/quote';
import { ProcurementPricecomparisonCompareItemDataService } from './data/item/compare-item-data.service';
import { get } from 'lodash';

/**
 * Price Comparison billing schema data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonBillingSchemaDataService extends CommonBillingSchemaDataService<ICommonBillingSchemaEntity, IQuoteItemEntity, QuoteItemComplete> {
	private readonly itemDataService = inject(ProcurementPricecomparisonCompareItemDataService);
	/**
	 * The constructor
	 */
	public constructor(public itemService: ProcurementPriceComparisonCompareItemDataExtensionService) {
		const qualifier = 'procurement.quote.billingschmema';
		super(itemService, qualifier);

		this.itemDataService.selectionChanged$.subscribe(selectedItems =>{
			this.itemService.setSelectedParentItem(selectedItems[0]);
			this.loadData();
		});
	}

	private loadData(){
		const column = this.itemService.getSelectColumn();
		if (column){
			this.loadSubEntities({ id: 0, pKey1: get(column, 'QuoteHeaderId') as unknown as number });
		}
	}

	protected override provideLoadPayload(): object {
		const column = this.itemService.getSelectColumn();
		return {
			MainItemId: get(column, 'QuoteHeaderId') as unknown as number,
			qualifier: this.qualifier
		};
	}

	protected override getRegenerateUrl(): IReculateUrlParameter {
		const baseUrl = this.apiUrl + '/reloadBillItems';
		const quote = this.itemService.selectedQuoteHeaderEntity;
		if (quote) {
			const rubCategoryFk = quote.RubricCategoryFk;
			const billingSchemaId = quote.BillingSchemaFk;
			return {
				baseUrl: baseUrl,
				params: {
					HeaderFK: quote?.Id,
					billingSchemaFk: billingSchemaId,
					rubricCategoryFk: rubCategoryFk,
					qualifier: this.qualifier
				}
			};
		} else {
			return  {
				baseUrl: baseUrl,
				params: {
					HeaderFK: -1,
					billingSchemaFk: -1,
					rubricCategoryFk: -1,
					qualifier: this.qualifier
				}
			};
		}
	}

	protected override getParentBillingSchemaId(quoteItem: IQuoteItemEntity): number {
		const quote = this.itemService.selectedQuoteHeaderEntity;
		if (quote){
			return quote.BillingSchemaFk;
		} else {
			return -1;
		}
	}

	protected getRubricCategory(quoteItem: IQuoteItemEntity): number {
		const quote = this.itemService.selectedQuoteHeaderEntity;
		if (quote){
			return quote.RubricCategoryFk;
		} else {
			return -1;
		}
	}

	public getExchangeRate(quoteItem: IQuoteItemEntity): number {
		const quote = this.itemService.selectedQuoteHeaderEntity;
		if (quote){
			return quote.ExchangeRate;
		} else {
			return -1;
		}
	}

	protected async doRecalculateBillingSchema(): Promise<ICommonBillingSchemaEntity[]> {
		const quote = this.itemService.selectedQuoteHeaderEntity;

		if (quote) {
			return this.http.get<ICommonBillingSchemaEntity[]>('procurement/quote/billingschema/Recalculate', { params: { headerFk: quote.Id } });
		}

		throw new Error('Quote item is not selected');
	}
}
