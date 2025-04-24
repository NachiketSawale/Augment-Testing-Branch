/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from './composite-base-entity.interface';
import { CompareGridColumn } from './compare-grid-column.interface';
import { ICompareRowEntity } from './compare-row-entity.interface';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface ICompareSettingBase<T extends ICompositeBaseEntity<T>> {
	gridColumns: CompareGridColumn<T>[];
	quoteColumns: ICustomCompareColumnEntity[];
	quoteDeletedColumns?: ICustomCompareColumnEntity[];
	quoteFields: ICompareRowEntity[];
	billingSchemaFields: ICompareRowEntity[];
	compareFields: ICompareRowEntity[];
	isFinalShowInTotal: boolean;
	isVerticalCompareRows: boolean;
	isShowLineValueColumn: boolean;
}