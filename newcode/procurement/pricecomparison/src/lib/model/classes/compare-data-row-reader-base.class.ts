/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { ICompareDataCellReader, ICompareDataRowReader } from '../entities/compare-data-reader.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { CompareGridColumn } from '../entities/compare-grid-column.interface';

export abstract class CompareDataRowReaderBase<T extends ICompositeBaseEntity<T>> {
	protected createRowReader(options?: Partial<ICompareDataRowReader<T>>): ICompareDataRowReader<T> {
		const reader = _.mergeWith({
			compareValue: function () {
				return true;
			},
			cell: []
		}, options);

		// Push the default reader to the last.
		reader.cell.push(this.createCellReader());

		return reader;
	}

	protected createCellReader(options?: Partial<ICompareDataCellReader<T>>): ICompareDataCellReader<T> {
		return _.mergeWith({
			compareValue: (columnDef: CompareGridColumn<T>, isVerticalCompareRows: boolean) => {
				return true;
			},
			readValue: (dataContext: T, columnDef: CompareGridColumn<T>) => {
				return dataContext[columnDef.field as string];
			},
			readFormattedValue: function (row: number, cell: number, dataContext: T, columnDef: CompareGridColumn<T>) {
				return _.toString(this.readValue(dataContext, columnDef));
			},
			valueType: null
		}, options);
	}

	protected isInvalidValue(originalValue: unknown): boolean {
		return _.includes([undefined], originalValue);
	}

	public abstract formatValue(dataContext: T, columnDef: CompareGridColumn<T>, field?: string, value?: unknown): string;

	public abstract createDataRowReaders(): ICompareDataRowReader<T>[];
}