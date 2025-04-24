/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector, inject } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { ProcurementPricecomparisonCompareBoqDataBaseService } from '../../data/boq/compare-boq-data-base.service';
import { ICompareRowEntity } from '../../../model/entities/compare-row-entity.interface';
import { ProcurementPricecomparisonComparePrintBoqSettingService } from '../setting/compare-print-boq-setting.service';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { ICompareBoqTypeSummary } from '../../../model/entities/boq/compare-boq-type-summary.interface';
import { IComparePrintBoqProfile } from '../../../model/entities/print/compare-print-boq-profile.interface';
import { ICompareBoqRange } from '../../../model/entities/boq/compare-boq-range.interface';
import { ComparePrintBoqTreeBuilder } from '../../../model/entities/boq/print/compare-print-boq-tree-builder.class';
import { CompareBoqTreeBuilder } from '../../../model/entities/boq/compare-boq-tree-builder.class';
import { CompareBoqColumnBuilder } from '../../../model/entities/boq/compare-boq-column-builder.class';
import { CompareBoqDataCache } from '../../../model/entities/boq/compare-boq-data-cache.class';
import { ICompareDataBoqRequest } from '../../../model/entities/boq/compare-data-boq-request.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintBoqDataService extends ProcurementPricecomparisonCompareBoqDataBaseService {
	private readonly injector = inject(Injector);

	public constructor(
		private printSettingSvc: ProcurementPricecomparisonComparePrintBoqSettingService
	) {
		super();
	}

	private _boqRanges: ICompareBoqRange[] = [];
	private _compareColumns: ICustomCompareColumnEntity[] = [];

	public get settings() {
		return this.printSettingSvc.getCurrentSetting();
	}

	public async loadBoqRanges(): Promise<ICompareBoqRange[]> {
		const rfq = this.settings.rfq as IComparePrintBoqProfile;
		const getParams = rfq.boq.checkedBoqRanges.map((item) => {
			return (item.boqHeaderId || 0) + ':' + (item.fromId || 0) + ':' + (item.fromBoqHeaderId || 0) + ':' + (item.toId || 0) + ':' + (item.toBoqHeaderId || 0);
		});
		const ranges = await this.http.get<ICompareBoqRange[]>('procurement/pricecomparison/print/getranges?values=' + getParams.join('_'));
		return this._boqRanges = ranges;
	}

	public async loadCompareColumns(): Promise<ICustomCompareColumnEntity[]> {
		return this._compareColumns = await this.utilService.getCompareColumns(this.compareType, this.settings.rfq.bidder.quotes);
	}

	protected getTreeBuilder(): CompareBoqTreeBuilder {
		return new ComparePrintBoqTreeBuilder(this);
	}

	protected getColumnBuilder(): CompareBoqColumnBuilder {
		return new CompareBoqColumnBuilder(this);
	}

	protected getDataCache(): CompareBoqDataCache {
		return new CompareBoqDataCache();
	}

	protected override provideCustomLoadPayload(payload: ICompareDataBoqRequest): ICompareDataBoqRequest {
		super.provideCustomLoadPayload(payload);
		payload.CompareColumns = this._compareColumns;
		return payload;
	}

	public override getCompareQuoteRows(): ICompareRowEntity[] {
		return this.settings.generic.row.boq.quoteFields;
	}

	public override getCompareBillingSchemaRows(): ICompareRowEntity[] {
		return this.settings.generic.row.boq.billingSchemaFields;
	}

	public override getCompareRows(): ICompareRowEntity[] {
		return this.settings.generic.row.boq.itemFields;
	}

	public override getCompareBaseColumns(): ICustomCompareColumnEntity[] {
		return this.settings.generic.bidder.boq;
	}

	public override isCalculateAsPerAdjustedQuantity(): boolean {
		return this.settings.generic.row.boq.isCalculateAsPerAdjustedQuantity;
	}

	public override isVerticalCompareRows(): boolean {
		return this.settings.generic.row.boq.isVerticalCompareRows;
	}

	public override isFinalShowInTotal(): boolean {
		return this.settings.generic.row.boq.isFinalShowInTotal;
	}

	public override getTypeSummary(): ICompareBoqTypeSummary {
		return this.settings.generic.boq;
	}

	public override getBoqRanges(): ICompareBoqRange[] {
		return this._boqRanges;
	}

	public override hideInsteadOfDeletingRows(): boolean {
		return false;
	}

	public override loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return Promise.resolve();
	}
}