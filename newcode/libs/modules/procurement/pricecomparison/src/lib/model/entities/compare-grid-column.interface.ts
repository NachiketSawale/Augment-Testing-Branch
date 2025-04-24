/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef } from '@libs/ui/common';
import { ICompositeBaseEntity } from './composite-base-entity.interface';

export type FormattedValue = string | number | null | unknown | undefined;

export type GridFormatter<T extends ICompositeBaseEntity<T>> = (row: number, cell: number, formattedValue: unknown, columnDef: CompareGridColumn<T>, dataContext: T) => FormattedValue;

export type CompareGridColumn<
	T extends ICompositeBaseEntity<T>
> = ColumnDef<T> & {
	isDynamic?: boolean;
	isIdealBidder?: boolean;
	originalField?: string;
	isVerticalCompareRows?: boolean;
	quoteKey?: string;
	isLineValue?: boolean;
	children?: CompareGridColumn<T>[];
	userLabelName?: string;
	groupName?: string;
	backgroundColor?: string,
	groupIndex?: number;
	hidden?: boolean;
	name?: string;
	name$tr$?: string;
	field?: string; // TODO-DRIZZLE: model or field?????
	parentId?: string;

	domain?: (dataContext: T, column: CompareGridColumn<T>) => void; // TODO-DRIZZLE: To be removed.
	dynamicFormatterFn?: (dataContext: T) => unknown; // TODO-DRIZZLE: To be removed.
	customFormatter?: GridFormatter<T>;
	[p: string]: unknown;
}