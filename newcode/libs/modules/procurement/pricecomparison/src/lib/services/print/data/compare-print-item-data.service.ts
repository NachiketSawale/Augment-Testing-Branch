/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { ProcurementPricecomparisonCompareItemDataBaseService } from '../../data/item/compare-item-data-base.service';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { ProcurementPricecomparisonComparePrintItemSettingService } from '../setting/compare-print-item-setting.service';
import { ICompareItemTypeSummary } from '../../../model/entities/item/compare-item-type-summary.interface';
import { ICompareDataBoqRequest } from '../../../model/entities/boq/compare-data-boq-request.interface';
import { CompareItemColumnBuilder } from '../../../model/entities/item/compare-item-column-builder.class';
import { CompareItemTreeBuilder } from '../../../model/entities/item/compare-item-tree-builder.class';
import { CompareItemDataCache } from '../../../model/entities/item/compare-item-data-cache.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintItemDataService extends ProcurementPricecomparisonCompareItemDataBaseService {
	public constructor(
		private printSettingSvc: ProcurementPricecomparisonComparePrintItemSettingService
	) {
		super();
	}

	private _compareColumns: ICustomCompareColumnEntity[] = [];

	private get settings() {
		return this.printSettingSvc.getCurrentSetting();
	}

	protected override provideCustomLoadPayload(payload: ICompareDataBoqRequest): ICompareDataBoqRequest {
		super.provideCustomLoadPayload(payload);
		payload.CompareColumns = this._compareColumns;
		return payload;
	}

	protected getTreeBuilder(): CompareItemTreeBuilder {
		return new CompareItemTreeBuilder(this);
	}

	protected getColumnBuilder(): CompareItemColumnBuilder {
		return new CompareItemColumnBuilder(this);
	}

	protected getDataCache(): CompareItemDataCache {
		return new CompareItemDataCache();
	}

	public async loadCompareColumns(): Promise<ICustomCompareColumnEntity[]> {
		return this._compareColumns = await this.utilService.getCompareColumns(this.compareType, this.settings.rfq.bidder.quotes);
	}

	public override getCompareQuoteRows(): ICompareRowEntity[] {
		return this.settings.generic.row.item.quoteFields;
	}

	public override getCompareBillingSchemaRows(): ICompareRowEntity[] {
		return this.settings.generic.row.item.billingSchemaFields;
	}

	public override getCompareRows(): ICompareRowEntity[] {
		return this.settings.generic.row.item.itemFields;
	}

	public override getCompareBaseColumns(): ICustomCompareColumnEntity[] {
		return this.settings.generic.bidder.item;
	}

	public override isVerticalCompareRows(): boolean {
		return this.settings.generic.row.item.isVerticalCompareRows;
	}

	public override isFinalShowInTotal(): boolean {
		return this.settings.generic.row.item.isFinalShowInTotal;
	}

	public override getTypeSummary(): ICompareItemTypeSummary {
		return this.settings.generic.item;
	}

	public override hideInsteadOfDeletingRows(): boolean {
		return false;
	}

	public override loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return Promise.resolve();
	}
}