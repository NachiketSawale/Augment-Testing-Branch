/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import {
	ProcurementQuoteBoqDataService,
	ProcurementQuoteHeaderDataService
} from '@libs/procurement/quote';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import * as _ from 'lodash';
import { ProcurementPricecomparisonCompareBoqDataService } from './compare-boq-data.service';
import { ICustomBoqItem } from '../../../model/entities/boq/custom-boq-item.interface';
import { IQuoteHeaderLookUpEntity, ProcurementShareQuoteLookupService } from '@libs/procurement/shared';
import { get } from 'lodash';

export const PROCUREMENT_PRICE_COMPARISON_BOQ_DATA_TOKEN = new InjectionToken<ProcurementPriceComparisonCompareBoqDataExtensionService>('procurementPriceComparisonItemDataToken');

/**
 * price comparison item data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonCompareBoqDataExtensionService extends ProcurementQuoteBoqDataService {
	private readonly boqDataService = inject(ProcurementPricecomparisonCompareBoqDataService);
	private readonly quoteLookupService = inject(ProcurementShareQuoteLookupService);
	public selectedParentItem: ICompositeBoqEntity | null = null;
	public selectedQuoteHeaderEntity: IQuoteHeaderLookUpEntity | null = null;

	public constructor(public readonly quoteHeaderDataService: ProcurementQuoteHeaderDataService) {
		super(quoteHeaderDataService);
		this.boqDataService.selectionChanged$.subscribe(selectedItems => {
			this.setSelectedParentItem(selectedItems[0]);
		});
	}

	public getSelectColumn(): object | null {
		const columns = this.boqDataService.compareCache.columns;
		const target = _.find(columns, c => c.BusinessPartnerId > 0) as unknown as ICustomBoqItem;
		if (target) {
			return target;
		} else {
			return null;
		}
	}

	public getBoqItem(): ICustomBoqItem | null {
		// TODO: should take the prcItem for bidder column by column's quoteKey
		if (this.selectedParentItem && this.selectedParentItem.LineTypeFk === 0 && this.selectedParentItem.QuoteItems && this.selectedParentItem.QuoteItems.length > 0) {
			const target = _.find(this.selectedParentItem.QuoteItems, { QuoteKey: 'QuoteCol_-1_-1_-1' }) as unknown as ICustomBoqItem;
			if (target) {
				return target;
			} else {
				return this.selectedParentItem.QuoteItems[0];
			}
		} else {
			return null;
		}
	}

	public setSelectedParentItem(selectedItem: ICompositeBoqEntity) {
		this.selectedParentItem = selectedItem;

		// TODO: should take the quote header for bidder column by column's quoteKey
		const column = this.getSelectColumn();
		if (column){
			const quoteId = get(column, 'QuoteHeaderId') as unknown as number;
			this.quoteLookupService.getItemByKey({ id: quoteId}).subscribe(item => {
				this.selectedQuoteHeaderEntity = item;
			});
		}
	}
}
