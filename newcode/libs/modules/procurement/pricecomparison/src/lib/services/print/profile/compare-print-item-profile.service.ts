/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import _ from 'lodash';
import { ComparePrintProfileServiceBase } from '../../../model/entities/print/compare-print-profile-service-base.class';
import { IComparePrintGenericProfile, IComparePrintBidder, IComparePrintColumn, IComparePrintRow } from '../../../model/entities/print/compare-print-generic-profile.interface';
import { ProcurementPricecomparisonCompareItemDataService } from '../../data/item/compare-item-data.service';
import { CompareGridColumn } from '../../../model/entities/compare-grid-column.interface';
import { ICompareItemTreeResponse } from '../../../model/entities/item/compare-item-tree-response.interface';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';
import { IComparePrintProfileComplete } from '../../../model/entities/print/compare-print-profile-complete.interface';
import { ICustomCompareColumnEntity } from '../../../model/entities/custom-compare-column-entity.interface';
import { IComparePrintItemProfile } from '../../../model/entities/print/compare-print-item-profile.interface';
import { CompareProfileTypes } from '../../../model/enums/compare-profile-types.enum';
import { IComparePrintItem } from '../../../model/entities/print/compare-print-item.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonComparePrintItemProfileService extends ComparePrintProfileServiceBase<
	ICompositeItemEntity,
	ICompareItemTreeResponse
> {
	public constructor(
		private readonly itemService: ProcurementPricecomparisonCompareItemDataService
	) {
		super(itemService);
	}

	protected processDefaultColumn(column: IComparePrintColumn, visibleColumns: CompareGridColumn<ICompositeItemEntity>[]): IComparePrintColumn {
		column.item.printColumns = visibleColumns;
		return column;
	}

	protected processRow(row: IComparePrintRow): IComparePrintRow {
		row.boq.quoteFields = this.itemService.getCompareQuoteRows();
		row.boq.billingSchemaFields = this.itemService.getCompareBillingSchemaRows();
		row.boq.itemFields = this.itemService.getCompareRows();
		row.boq.isVerticalCompareRows = this.itemService.isVerticalCompareRows();
		row.boq.isLineValueColumn = this.itemService.isLineValueColumnVisible();
		row.boq.isFinalShowInTotal = this.itemService.isFinalShowInTotal();
		return row;
	}

	public processInitialGenericProfile(profile: IComparePrintGenericProfile, baseBidder: IComparePrintBidder): IComparePrintGenericProfile {
		return _.extend(profile, {
			column: super.getDefaultColumnsSetting(),
			row: super.getAllRowConfig(),
			bidder: {
				item: this.itemService.getCompareBaseColumns() || baseBidder.item
			}
		});
	}

	public getRfqProfileCacheMap(): Map<number, IComparePrintProfileEntity[]> {
		return this.rfqProfileCache.items;
	}

	public getProfileType(): CompareProfileTypes {
		return CompareProfileTypes.item;
	}

	public getBidders(): Promise<ICustomCompareColumnEntity[]> {
		return this.itemService.loadQuoteColumns();
	}

	public provideInitialRfqProfile(complete: IComparePrintProfileComplete): Promise<IComparePrintItemProfile> {
		return Promise.resolve(complete.item);
	}

	public toGenericProfile(setting: IComparePrintItem, generic?: IComparePrintGenericProfile): IComparePrintGenericProfile {
		const config = {
			pageLayout: setting.pageLayout,
			report: setting.report,
			bidder: {
				item: setting.quoteColumns,
			},
			item: {
				checkedItemTypes: setting.itemTypes.filter(e => e.IsChecked).map(e => e.Id),
				checkedItemTypes2: setting.itemTypes2.filter(e => e.IsChecked).map(e => e.Id),
			},
			column: {
				item: {
					printColumns: setting.gridColumns
				}
			},
			row: {
				item: {
					billingSchemaFields: setting.billingSchemaFields,
					itemFields: setting.compareFields,
					quoteFields: setting.quoteFields,
					isFinalShowInTotal: setting.isFinalShowInTotal,
					isLineValueColumn: setting.isShowLineValueColumn,
					isVerticalCompareRows: setting.isVerticalCompareRows,
				}
			},
		} as IComparePrintGenericProfile;

		return generic ? config : _.mergeWith({}, generic, config);
	}

	public toRfqProfile(setting: IComparePrintItem, rfq?: IComparePrintItemProfile): IComparePrintItemProfile {
		return rfq ? _.mergeWith({}, rfq, setting.item) : setting.item;
	}

	public toGenericSetting(generic: IComparePrintGenericProfile, setting: IComparePrintItem): IComparePrintItem {
		if (generic) {
			setting.gridColumns = generic.column.item.printColumns;
			setting.quoteFields = generic.row.item.quoteFields;
			setting.billingSchemaFields = generic.row.item.billingSchemaFields;
			setting.compareFields = generic.row.item.itemFields;
			setting.isFinalShowInTotal = generic.row.item.isFinalShowInTotal;
			setting.isVerticalCompareRows = generic.row.item.isVerticalCompareRows;
			setting.isShowLineValueColumn = generic.row.item.isLineValueColumn;
			setting.report = generic.report;
			setting.pageLayout = generic.pageLayout;
			setting.itemTypes.forEach(e => {
				e.IsChecked = generic.item.checkedItemTypes.includes(e.Id);
			});
			setting.itemTypes2.forEach(e => {
				e.IsChecked = generic.item.checkedItemTypes2.includes(e.Id);
			});
		}
		return setting;
	}

	public toRfqSetting(rfq: IComparePrintItemProfile, setting: IComparePrintItem): IComparePrintItem {
		if (rfq) {
			setting.quoteColumns = rfq.bidder.quotes;
			setting.item = rfq;
		}
		return setting;
	}
}