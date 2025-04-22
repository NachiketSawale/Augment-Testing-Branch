/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareTypes } from '../enums/compare.types.enum';
import { ICompareRowEntity } from './compare-row-entity.interface';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface ICompareDataRequestBase {
	RfqHeaderId: number;
	CompareType: CompareTypes;
	CompareQuoteRows?: ICompareRowEntity[];
	CompareBillingSchemaRows?: ICompareRowEntity[];
	CompareRows: ICompareRowEntity[];
	CompareColumns?: ICustomCompareColumnEntity[];
	CompareBaseColumns?: ICustomCompareColumnEntity[];
	Version: number;
}