/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ComparePrintSettingServiceBase } from '../../../model/entities/print/compare-print-setting-service-base.class';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { ICompareItemTreeResponse } from '../../../model/entities/item/compare-item-tree-response.interface';
import { ProcurementPricecomparisonComparePrintItemProfileService } from '../profile/compare-print-item-profile.service';
import { ProcurementPricecomparisonCompareItemDataService } from '../../data/item/compare-item-data.service';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';
import { IComparePrintGenericProfile } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { IComparePrintItem } from '../../../model/entities/print/compare-print-item.interface';
import { IComparePrintItemProfile } from '../../../model/entities/print/compare-print-item-profile.interface';
import { CompareProfileTypes } from '../../../model/enums/compare-profile-types.enum';

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintItemSettingService extends ComparePrintSettingServiceBase<
	ICompositeItemEntity,
	ICompareItemTreeResponse
> {
	public constructor(
		private itemProfileService: ProcurementPricecomparisonComparePrintItemProfileService,
		private itemDataSvc: ProcurementPricecomparisonCompareItemDataService
	) {
		super(itemProfileService, itemDataSvc);
	}

	protected getCurrentRfqProfileCache(rfqHeaderId: number): IComparePrintProfileEntity | null {
		const current = this.rfqProfileCache.current.has(rfqHeaderId) ? this.rfqProfileCache.current.get(rfqHeaderId) : null;
		return current ? current.item : null;
	}

	protected syncCurrentGenericSetting(generic: IComparePrintGenericProfile, settings: IComparePrintItem): void {
		generic.bidder.item = settings.quoteColumns;
		generic.column.item.printColumns = settings.gridColumns;
		generic.row.item.itemFields = settings.compareFields;
		generic.row.item.quoteFields = settings.quoteFields;
		generic.row.item.isVerticalCompareRows = settings.isVerticalCompareRows;
		generic.row.item.isFinalShowInTotal = settings.isFinalShowInTotal;
		generic.row.item.billingSchemaFields = settings.billingSchemaFields;
		generic.row.item.isLineValueColumn = settings.isShowLineValueColumn;
	}

	protected syncCurrentRfqSetting(rfq: IComparePrintItemProfile, settings: IComparePrintItem): void {
		rfq.bidder.quotes = settings.quoteColumns;
	}

	public getProfileType(): CompareProfileTypes {
		return CompareProfileTypes.item;
	}
}