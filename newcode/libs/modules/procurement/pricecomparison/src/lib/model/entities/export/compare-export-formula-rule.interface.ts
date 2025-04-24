/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { CompareGridColumn } from '../compare-grid-column.interface';
import { ICompareExportLookupMap } from './compare-export-lookup-map.interface';
import { ICompareExportUserDataBase } from './compare-export-user-data.interface';
import { ICompareExportDataRowDic } from './compare-export-data-row-dic.interface';

export interface ICompareExportCellFormulaRule<
	T extends ICompositeBaseEntity<T>,
	UT extends ICompareExportUserDataBase
> {
	formula: ((currRow: T, isVerticalCompareRows: boolean, userData: UT) => string) | string,
	cell: (row: T, column: CompareGridColumn<T>, isVerticalCompareRows: boolean) => boolean | null | undefined,
	expression: {
		[p: string]: (rows: T[], currRow: T, columns: CompareGridColumn<T>[], col: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) => string | null | undefined;
	},
	disabled?: (rows: T[], currRow: T, columns: CompareGridColumn<T>[], col: CompareGridColumn<T>, colIndex: number, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) => boolean
}

export interface ICompareExportRowFormulaRule<
	T extends ICompositeBaseEntity<T>,
	UT extends ICompareExportUserDataBase
> {
	label: string,
	row: (row: T, isVerticalCompareRows: boolean) => boolean,
	cells: ICompareExportCellFormulaRule<T, UT>[],
	disabled?: (rows: T[], currRow: T, isVerticalCompareRows: boolean, lookupMap: ICompareExportLookupMap, userData: UT, dataRowDic: ICompareExportDataRowDic<T>) => boolean
}