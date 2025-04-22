/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ComparePrintSettingServiceBase } from '../../../model/entities/print/compare-print-setting-service-base.class';
import { ProcurementPricecomparisonComparePrintBoqProfileService } from '../profile/compare-print-boq-profile.service';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from '../../../model/entities/boq/compare-boq-tree-response.interface';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../data/boq/compare-boq-data.service';
import { CompareTypes } from '../../../model/enums/compare.types.enum';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { IComparePrintBoqProfile, IComparePrintBoqRange } from '../../../model/entities/print/compare-print-boq-profile.interface';
import { ICompareBoqRangeEntity } from '../../../model/entities/boq/compare-boq-setting.interface';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';
import { IComparePrintGenericProfile } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { IComparePrintBoq } from '../../../model/entities/print/compare-print-boq.interface';
import { CompareProfileTypes } from '../../../model/enums/compare-profile-types.enum';

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintBoqSettingService extends ComparePrintSettingServiceBase<
	ICompositeBoqEntity,
	ICompareBoqTreeResponse
> {
	public constructor(
		private boqProfileService: ProcurementPricecomparisonComparePrintBoqProfileService,
		private boqDataSvc: ProcurementPricecomparisonCompareBoqDataService
	) {
		super(boqProfileService, boqDataSvc);
	}

	protected getCurrentRfqProfileCache(rfqHeaderId: number): IComparePrintProfileEntity | null {
		const current = this.rfqProfileCache.current.has(rfqHeaderId) ? this.rfqProfileCache.current.get(rfqHeaderId) : null;
		return current ? current.boq : null;
	}

	protected syncCurrentGenericSetting(generic: IComparePrintGenericProfile, settings: IComparePrintBoq): void {
		generic.bidder.boq = settings.quoteColumns;
		generic.column.boq.printColumns = settings.gridColumns;
		generic.row.boq.itemFields = settings.compareFields;
		generic.row.boq.quoteFields = settings.quoteFields;
		generic.row.boq.isVerticalCompareRows = settings.isVerticalCompareRows;
		generic.row.boq.isFinalShowInTotal = settings.isFinalShowInTotal;
		generic.row.boq.billingSchemaFields = settings.billingSchemaFields;
		generic.row.boq.isCalculateAsPerAdjustedQuantity = settings.isCalculateAsPerAdjustedQuantity;
		generic.row.boq.isLineValueColumn = settings.isShowLineValueColumn;
	}

	protected syncCurrentRfqSetting(rfq: IComparePrintBoqProfile, settings: IComparePrintBoq): void {
		rfq.bidder.quotes = settings.quoteColumns;
		rfq.boq = settings.boq.boq;
		rfq.analysis = settings.boq.analysis;
	}

	public getProfileType(): CompareProfileTypes {
		return CompareProfileTypes.boq;
	}

	public async getMergeTree(rfqHeaderId: number, columns: ICustomCompareColumnEntity[], checkedBoqRanges: IComparePrintBoqRange[]): Promise<ICompareBoqRangeEntity[]> {
		const rfqs = await this.httpService.post<Array<ICompositeBoqEntity[]>>('procurement/pricecomparison/boq/getmergetree', {
			RfqHeaderId: rfqHeaderId,
			CompareType: CompareTypes.BoQ,
			CompareColumns: columns,
			Version: 2
		});
		const ranges: ICompareBoqRangeEntity[] = [];
		rfqs.forEach((reqs) => {
			reqs.forEach((req) => {
				req.Children.forEach((root) => {
					// TODO-DRIZZLE: To be checked.
					// setParentId(root, 'BoqItemId', 'ParentId');
					// root.boqItems = cloudCommonGridService.flatten([root], [], 'BoqItemChildren');
					const range: ICompareBoqRangeEntity = {
						Id: root.Id,
						Reference: root.Reference,
						Brief: root.Brief
					};
					checkedBoqRanges.forEach((checkedBoqRange) => {
						if (root.BoqHeaderId === checkedBoqRange.boqHeaderId) {
							range.BoqHeaderFkFrom = checkedBoqRange.fromId;
							range.BoqHeaderFkTo = checkedBoqRange.toId;
						}
					});
					ranges.push(range);
				});
			});
		});
		return ranges;
	}
}