/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareRowEntity } from './compare-row-entity.interface';
import { ICompareBoqTypeSummary } from './boq/compare-boq-type-summary.interface';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface ICompareCustomData {
	compareBillingSchemaRows: ICompareRowEntity[],
	compareQuoteRows: ICompareRowEntity[],
	compareRows: ICompareRowEntity[],
	compareBaseColumns: ICustomCompareColumnEntity[],
	compareTypeSummaryFields?: ICompareBoqTypeSummary,
	isVerticalCompareRows?: boolean,
	isLineValueColumn?: boolean,
	isFinalShowInTotal?: boolean
}