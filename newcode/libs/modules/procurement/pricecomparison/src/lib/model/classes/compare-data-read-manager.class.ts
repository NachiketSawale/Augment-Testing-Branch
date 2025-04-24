/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareDataCellReader, ICompareDataRowReader } from '../entities/compare-data-reader.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { CompareGridColumn } from '../entities/compare-grid-column.interface';

export class CompareDataReadManager<T extends ICompositeBaseEntity<T>> {
	public constructor(
		private rowReaders: ICompareDataRowReader<T>[],
		private isVerticalCompareRows: () => boolean,
		private isShowInSummaryActivated: () => boolean
	) {
	}

	public getRowReader(dataContext: T) {
		return this.rowReaders.find(r => {
			return r.compareValue(dataContext, this.isVerticalCompareRows());
		});
	}

	public getCellReader(dataContext: T, columnDef: CompareGridColumn<T>, rowReader?: ICompareDataRowReader<T>) {
		if (!rowReader) {
			rowReader = this.getRowReader(dataContext);
		}
		return rowReader?.cell.find(r => {
			return r.compareValue(columnDef, this.isVerticalCompareRows());
		});
	}

	public readCellValue(dataContext: T, columnDef: CompareGridColumn<T>, cellReader?: ICompareDataCellReader<T>, rowReader?: ICompareDataRowReader<T>) {
		if (!cellReader) {
			cellReader = this.getCellReader(dataContext, columnDef, rowReader);
		}
		return cellReader ? cellReader.readValue(dataContext, columnDef) : undefined;
	}

	public readCellFormattedValue(row: number, cell: number, dataContext: T, columnDef: CompareGridColumn<T>, cellReader?: ICompareDataCellReader<T>, rowReader?: ICompareDataRowReader<T>) {
		if (!cellReader) {
			cellReader = this.getCellReader(dataContext, columnDef, rowReader);
		}
		return cellReader ? cellReader.readFormattedValue(row, cell, dataContext, columnDef) : undefined;
	}

	public readCellValueType(dataContext: T, columnDef: CompareGridColumn<T>, cellReader?: ICompareDataCellReader<T>, rowReader?: ICompareDataRowReader<T>) {
		if (!cellReader) {
			cellReader = this.getCellReader(dataContext, columnDef, rowReader);
		}
		return cellReader ? (cellReader.readValueType ? cellReader.readValueType(dataContext, columnDef, this.isShowInSummaryActivated()) : undefined) : undefined;
	}

	public readCellFormatCode(dataContext: T, columnDef: CompareGridColumn<T>, cellReader?: ICompareDataCellReader<T>, rowReader?: ICompareDataRowReader<T>) {
		if (!cellReader) {
			cellReader = this.getCellReader(dataContext, columnDef, rowReader);
		}
		return cellReader ? (cellReader.readFormatCode ? cellReader.readFormatCode(dataContext, columnDef, this.isShowInSummaryActivated()) : undefined) : undefined;
	}
}