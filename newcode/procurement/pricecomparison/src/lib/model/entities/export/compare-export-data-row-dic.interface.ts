/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { CompareGridColumn } from '../compare-grid-column.interface';

export interface ICompareExportDataRowDic<T extends ICompositeBaseEntity<T>> {
	rows: Map<string, { value: T, index: number }>,
	columns: Map<string, { value: CompareGridColumn<T>, index: number }>,
	bidderColumns: CompareGridColumn<T>[];
	countInTargetColumns: CompareGridColumn<T>[];
}