/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import _ from 'lodash';
import { ComparePrintProfileServiceBase } from '../../../model/entities/print/compare-print-profile-service-base.class';
import { IComparePrintGenericProfile, IComparePrintBidder, IComparePrintColumn, IComparePrintRow } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../data/boq/compare-boq-data.service';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
import { ICompareBoqTreeResponse } from '../../../model/entities/boq/compare-boq-tree-response.interface';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';
import { IComparePrintProfileComplete } from '../../../model/entities/print/compare-print-profile-complete.interface';
import { IComparePrintBoqProfile } from '../../../model/entities/print/compare-print-boq-profile.interface';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { CompareProfileTypes } from '../../../model/enums/compare-profile-types.enum';
import { IComparePrintRfqProfile } from '../../../model/entities/print/compare-print-rfq-profile.interface';
import { IComparePrintBoq } from '../../../model/entities/print/compare-print-boq.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintBoqProfileService extends ComparePrintProfileServiceBase<
	ICompositeBoqEntity,
	ICompareBoqTreeResponse
> {
	public constructor(
		private readonly boqService: ProcurementPricecomparisonCompareBoqDataService
	) {
		super(boqService);
	}

	protected processDefaultColumn(column: IComparePrintColumn, visibleColumns: CompareGridColumn<ICompositeBoqEntity>[]): IComparePrintColumn {
		column.boq.printColumns = visibleColumns;
		return column;
	}

	protected processRow(row: IComparePrintRow): IComparePrintRow {
		row.boq.quoteFields = this.boqService.getCompareQuoteRows();
		row.boq.billingSchemaFields = this.boqService.getCompareBillingSchemaRows();
		row.boq.itemFields = this.boqService.getCompareRows();
		row.boq.isVerticalCompareRows = this.boqService.isVerticalCompareRows();
		row.boq.isLineValueColumn = this.boqService.isLineValueColumnVisible();
		row.boq.isFinalShowInTotal = this.boqService.isFinalShowInTotal();
		row.boq.isCalculateAsPerAdjustedQuantity = this.boqService.isCalculateAsPerAdjustedQuantity();
		return row;
	}

	public processInitialGenericProfile(profile: IComparePrintGenericProfile, baseBidder: IComparePrintBidder): IComparePrintGenericProfile {
		return _.extend(profile, {
			column: super.getDefaultColumnsSetting(),
			row: super.getAllRowConfig(),
			bidder: {
				boq: this.boqService.getCompareBaseColumns() || baseBidder.boq,
				item: []
			},
			boq: this.boqService.getTypeSummary()
		});
	}

	public getRfqProfileCacheMap(): Map<number, IComparePrintProfileEntity[]> {
		return this.rfqProfileCache.boqs;
	}

	public getProfileType(): CompareProfileTypes {
		return CompareProfileTypes.boq;
	}

	public getBidders(): Promise<ICustomCompareColumnEntity[]> {
		return this.boqService.loadQuoteColumns();
	}

	public provideInitialRfqProfile(complete: IComparePrintProfileComplete): Promise<IComparePrintBoqProfile> {
		return Promise.resolve(complete.boq);
	}

	public toGenericProfile(setting: IComparePrintBoq, generic?: IComparePrintGenericProfile): IComparePrintGenericProfile {
		const config = {
			pageLayout: setting.pageLayout,
			report: setting.report,
			bidder: {
				boq: setting.quoteColumns,
			},
			boq: {
				checkedLineTypes: setting.structures.filter(e => e.IsChecked).map(e => e.Id),
				checkedBoqItemTypes: setting.itemTypes.filter(e => e.IsChecked).map(e => e.Id),
				checkedBoqItemTypes2: setting.itemTypes2.filter(e => e.IsChecked).map(e => e.Id),
				boqItemTypesInfos: setting.itemTypes.map(e => {
					return {Id: e.Id, UserLabelName: e.UserLabelName};
				}),
				boqItemTypes2Infos: setting.itemTypes2.map(e => {
					return {Id: e.Id, UserLabelName: e.UserLabelName};
				}),
				hideZeroValueLines: setting.isHideZeroValueLines,
				percentageLevels: setting.isPercentageLevels
			},
			column: {
				boq: {
					printColumns: setting.gridColumns
				}
			},
			row: {
				boq: {
					billingSchemaFields: setting.billingSchemaFields,
					itemFields: setting.compareFields,
					quoteFields: setting.quoteFields,
					isFinalShowInTotal: setting.isFinalShowInTotal,
					isLineValueColumn: setting.isShowLineValueColumn,
					isVerticalCompareRows: setting.isVerticalCompareRows,
					isCalculateAsPerAdjustedQuantity: setting.isCalculateAsPerAdjustedQuantity
				}
			},
		} as IComparePrintGenericProfile;

		return generic ? config : _.mergeWith({}, generic, config);
	}

	public toRfqProfile(setting: IComparePrintBoq, rfq?: IComparePrintBoqProfile): IComparePrintRfqProfile {
		return rfq ? _.mergeWith({}, rfq, setting.boq) : setting.boq;
	}

	public toGenericSetting(generic: IComparePrintGenericProfile, setting: IComparePrintBoq): IComparePrintBoq {
		if (generic) {
			setting.gridColumns = generic.column.boq.printColumns;
			setting.quoteFields = generic.row.boq.quoteFields;
			setting.billingSchemaFields = generic.row.boq.billingSchemaFields;
			setting.compareFields = generic.row.boq.itemFields;
			setting.isFinalShowInTotal = generic.row.boq.isFinalShowInTotal;
			setting.isVerticalCompareRows = generic.row.boq.isVerticalCompareRows;
			setting.isShowLineValueColumn = generic.row.boq.isLineValueColumn;
			setting.report = generic.report;
			setting.pageLayout = generic.pageLayout;
			setting.isCalculateAsPerAdjustedQuantity = generic.row.boq.isCalculateAsPerAdjustedQuantity;
			setting.itemTypes.forEach(e => {
				e.IsChecked = generic.boq.checkedBoqItemTypes.includes(e.Id);
			});
			setting.itemTypes2.forEach(e => {
				e.IsChecked = generic.boq.checkedBoqItemTypes.includes(e.Id);
			});
			setting.isPercentageLevels = generic.boq.percentageLevels;
			setting.isHideZeroValueLines = generic.boq.hideZeroValueLines;
		}
		return setting;
	}

	public toRfqSetting(rfq: IComparePrintBoqProfile, setting: IComparePrintBoq): IComparePrintBoq {
		if (rfq) {
			setting.quoteColumns = rfq.bidder.quotes;
			setting.boq = rfq;
		}
		return setting;
	}
}