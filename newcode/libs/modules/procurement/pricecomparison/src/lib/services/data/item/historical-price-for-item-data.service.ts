/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BasicsSharedHistoricalPriceForItemDataService
} from '@libs/basics/shared';
import { ProcurementPricecomparisonCompareItemDataService } from './compare-item-data.service';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../rfq-header-data.service';
import { IBasicsHistoricalPriceForItemParentData } from '@libs/basics/common';
import { ProcurementPricecomparisonUtilService } from '../../util.service';
import { IPrcItemEntity, PrcCommonItemComplete } from '@libs/procurement/common';


/**
 * Represents the data service to handle rfq requisition field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IPrcItemEntity, PrcCommonItemComplete> {
	private readonly itemService;
	private readonly rfqHeaderService;
	protected readonly utilService = inject(ProcurementPricecomparisonUtilService);

	public constructor() {
		const parentService = inject(ProcurementPricecomparisonCompareItemDataService);
		const rfqHeaderService = inject(ProcurementPricecomparisonRfqHeaderDataService);
		super(parentService, rfqHeaderService);

		this.itemService = parentService;
		this.rfqHeaderService = rfqHeaderService;
	}

	public override getParentItem(): IBasicsHistoricalPriceForItemParentData {
		const rfqHeader = this.rfqHeaderService.getSelectedEntity();
		const item: IBasicsHistoricalPriceForItemParentData = {
			Id: -1,
			CurrencyFk: -1,
			BasCurrencyFk: -1,
			ProjectFk: -1,
			ExchangeRate: 1 // TODO: ExchangeRate should took from PrcItem
		};
		const row = this.itemService.getSelectedEntity() as ICompositeItemEntity;
		if (rfqHeader && row && row.LineTypeFk === 0) {
			item.Id = row.PrcItemId;
			item.CurrencyFk = rfqHeader.CurrencyFk;
			item.BasCurrencyFk = rfqHeader.CurrencyFk;
			item.ProjectFk = rfqHeader.ProjectFk;
		}
		return item;
	}
}
