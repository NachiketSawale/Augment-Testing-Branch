/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from './composite-base-entity.interface';
import { CompareGridColumn } from './compare-grid-column.interface';

export interface ICompareDataCellReader<T extends ICompositeBaseEntity<T>> {
	compareValue: (columnDef: CompareGridColumn<T>, isVerticalCompareRows: boolean) => boolean;
	readValue: (dataContext: T, columnDef: CompareGridColumn<T>) => unknown;
	readFormattedValue: (row: number, cell: number, dataContext: T, columnDef: CompareGridColumn<T>) => string | undefined | null;
	readValueType?: (dataContext: T, columnDef: CompareGridColumn<T>, isShowInSummaryActivated: boolean) => string | undefined | null;
	readFormatCode?: (dataContext: T, columnDef: CompareGridColumn<T>, isShowInSummaryActivated: boolean) => string | undefined | null;
}

export interface ICompareDataRowReader<T extends ICompositeBaseEntity<T>> {
	compareValue: (dataContext: T, isVerticalCompareRows: boolean) => boolean;
	cell: ICompareDataCellReader<T>[];
}