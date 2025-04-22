/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IQuoteItemEntity } from '@libs/procurement/quote';
import {
	IPrcItemEntity, PrcCommonItemComplete,
	ProcurementCommonPriceConditionDataService
} from '@libs/procurement/common';
import { IPriceConditionContext } from '@libs/basics/shared';
import { ProcurementPricecomparisonRfqHeaderDataService } from './rfq-header-data.service';
import { ProcurementPriceComparisonCompareItemDataExtensionService } from './data/item/compare-item-data-extension.service';
import { ProcurementPricecomparisonCompareItemDataService } from './data/item/compare-item-data.service';

export const PROCUREMENT_PRICE_COMPARISON_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<ProcurementPriceComparisonPriceConditionDataService>('procurementPriceComparisonPriceConditionDataService');

/**
 * The PrcItem PriceCondition service in price comparison
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonPriceConditionDataService extends ProcurementCommonPriceConditionDataService<IPrcItemEntity, PrcCommonItemComplete> {
	protected internalModuleName = 'procurement.pricecomparison';
	private readonly rfqHeaderService = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly itemDataService = inject(ProcurementPricecomparisonCompareItemDataService);

	public constructor(protected itemService: ProcurementPriceComparisonCompareItemDataExtensionService) {
		super(itemService);

		this.itemDataService.selectionChanged$.subscribe(selectedItems => {
			this.itemService.setSelectedParentItem(selectedItems[0]);
			this.loadData();
		});
	}

	protected override provideLoadPayload(): object {
		const prcItem = this.itemService.getPrcItem();
		if (prcItem) {
			return {
				mainItemId: prcItem.PrcItemId
			};
		} else {
			return {
				mainItemId: -1
			};
		}
	}

	private loadData() {
		const prcItem = this.itemService.getPrcItem();
		if (prcItem) {
			this.loadSubEntities({id: 0, pKey1: prcItem.PrcItemId}).then();
		}
	}

	public getContextFromParent(): IPriceConditionContext {
		const rfqHeader = this.rfqHeaderService.getSelectedEntity() as IRfqHeaderEntity;
		let headerId = -1;
		let projectId = -1;
		let prcPriceConditionId: number | null = -1;
		let exchangeRate = 1;
		if (this.itemService.getSelection().length > 0) {
			const parentItem = this.itemService.getSelectedEntity() as IQuoteItemEntity;
			headerId = rfqHeader.Id;
			prcPriceConditionId = parentItem.PrcPriceConditionFk ?? null;
			exchangeRate = 1; // TODO: take exchange rate from rfq
			if (rfqHeader.ProjectFk) {
				projectId = rfqHeader.ProjectFk;
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

	public override canCreate(): boolean {
		return false;
	}

	public override canDelete(): boolean {
		return false;
	}
}