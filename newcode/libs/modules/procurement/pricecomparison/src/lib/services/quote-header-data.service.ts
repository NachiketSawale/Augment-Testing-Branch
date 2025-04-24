/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IQuoteHeaderEntity, ProcurementQuoteHeaderDataService } from '@libs/procurement/quote';
import * as _ from 'lodash';
import { ProcurementPricecomparisonCompareItemDataService } from './data/item/compare-item-data.service';
import { ICompositeItemEntity } from '../model/entities/item/composite-item-entity.interface';

export const PROCUREMENT_PRICE_COMPARISON_QUOTE_HEADER_DATA_TOKEN = new InjectionToken<ProcurementPriceComparisonQuoteHeaderDataService>('procurementPriceComparisonQuoteHeaderDataService');

/**
 * price comparison item data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonQuoteHeaderDataService extends ProcurementQuoteHeaderDataService {
	private readonly itemDataService = inject(ProcurementPricecomparisonCompareItemDataService);
	public selectedParentItem: ICompositeItemEntity | null = null;

	public constructor() {
		super();
		this.itemDataService.selectionChanged$.subscribe(selectedItems => {
			this.setSelectedParentItem(selectedItems[0]);
		});
	}

	public getQuoteHeader(): IQuoteHeaderEntity | null {
		// TODO: should take the prcItem for bidder column by column's quoteKey
		if (this.selectedParentItem && this.selectedParentItem.LineTypeFk === 0 && this.selectedParentItem.QuoteItems && this.selectedParentItem.QuoteItems.length > 0) {
			const target = _.find(this.selectedParentItem.QuoteItems, { QuoteKey: 'QuoteCol_-1_-1_-1' }) as unknown as IQuoteHeaderEntity;
			if (target) {
				return target;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	public setSelectedParentItem(selectedItem: ICompositeItemEntity) {
		this.selectedParentItem = selectedItem;
	}
}
