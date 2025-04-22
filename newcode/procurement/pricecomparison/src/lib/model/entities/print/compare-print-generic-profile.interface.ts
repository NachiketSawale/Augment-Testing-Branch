/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareGridColumn } from '../compare-grid-column.interface';
import { ICompositeItemEntity } from '../item/composite-item-entity.interface';
import { ICompositeBoqEntity } from '../boq/composite-boq-entity.interface';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { ICompareBoqTypeSummary } from '../boq/compare-boq-type-summary.interface';
import { ICompareItemTypeSummary } from '../item/compare-item-type-summary.interface';

export interface IComparePrintBidder {
	boq: ICustomCompareColumnEntity[];
	item: ICustomCompareColumnEntity[];
}

export interface IComparePrintPageLayout {
	orientation: string;
	paperSize: number;
}

export interface IComparePrintReport {
	bidderNameCheck: boolean;
	bidderNameTemplate: string;
	bidderPageSize: number;
	bidderPageSizeCheck: boolean;
	coverSheetCheck: boolean;
	coverSheetTemplateId: number | null | undefined;
	header: IComparePrintCustomInfo;
	footer: IComparePrintCustomInfo;
	shortenOutlineSpecValue: number,
	shortenOutlineSpecCheck: boolean
}

export interface IComparePrintBoq extends ICompareBoqTypeSummary {

}

export interface IComparePrintItem extends ICompareItemTypeSummary {

}

export interface IComparePrintColumn {
	boq: {
		printColumns: CompareGridColumn<ICompositeBoqEntity>[]
	},
	item: {
		printColumns: CompareGridColumn<ICompositeItemEntity>[]
	}
}

export interface IComparePrintRowBase {
	billingSchemaFields: ICompareRowEntity[];
	itemFields: ICompareRowEntity[];
	quoteFields: ICompareRowEntity[];
	isFinalShowInTotal: boolean;
	isLineValueColumn: boolean;
	isVerticalCompareRows: boolean;
}

export interface IComparePrintBoqRow extends IComparePrintRowBase {
	isCalculateAsPerAdjustedQuantity: boolean;
}

export interface IComparePrintItemRow extends IComparePrintRowBase {

}

export interface IComparePrintRow {
	boq: IComparePrintBoqRow;
	item: IComparePrintItemRow;
}

export interface IComparePrintCustomInfo {
	leftPicture: string;
	leftTemplate: string;
	middlePicture: string;
	middleTemplate: string;
	rightPicture: string;
	rightTemplate: string;
}

export interface IComparePrintGenericProfile {
	pageLayout: IComparePrintPageLayout;
	report: IComparePrintReport;
	bidder: IComparePrintBidder;
	boq: IComparePrintBoq;
	item: IComparePrintItem,
	column: IComparePrintColumn,
	row: IComparePrintRow,
}