/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICompareExportStyleInfo {
	Name: string;
	Value: unknown;
}

export interface ICompareExportCellInfo {
	/**
	 * Field
	 */
	f: string;
	/**
	 * Value
	 */
	v?: unknown;
	/**
	 * ValueType
	 */
	vt?: number;
	/**
	 * FormatCode
	 */
	fc?: string;
	/**
	 * FormattedValue
	 */
	fv?: string;
	/**
	 * Styles
	 */
	st?: ICompareExportStyleInfo[];
	/**
	 * Formula
	 */
	fm?: string;
}

export interface ICompareExportColumnInfo {
	Field: string;
	Name: string;
	Width: number;
	IsHidden: boolean;
	Span: number;
	MergeSpec?: string;
}

export interface ICompareExportRowInfo {
	/**
	 * Level
	 */
	lv: number;
	/**
	 * Cells
	 */
	cl: ICompareExportCellInfo[];
	/**
	 * IsHidden
	 */
	h?: boolean;
	/**
	 * Styles
	 */
	st?: ICompareExportStyleInfo[];
}

export interface ICompareExportSheetInfo {
	SheetName: string;
	Columns: ICompareExportColumnInfo[];
	Rows: ICompareExportRowInfo[];
	ColumnGroups: ICompareExportColumnInfo[];
}

export interface ICompareExportOptions {
	RfqHeaderId: number;
	Sheets: ICompareExportSheetInfo[];
}