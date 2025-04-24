/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareRowEntity } from './compare-row-entity.interface';
import { CompareTypes } from '../enums/compare.types.enum';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface ICompareRequestEntity {
	/**
	 * CompareBaseColumns
	 */
	CompareBaseColumns?: ICustomCompareColumnEntity[] | null;

	/**
	 * CompareBillingSchemaRows
	 */
	CompareBillingSchemaRows?: ICompareRowEntity[] | null;

	/**
	 * CompareColumns
	 */
	CompareColumns?: ICustomCompareColumnEntity[] | null;

	/**
	 * CompareQuoteRows
	 */
	CompareQuoteRows?: ICompareRowEntity[] | null;

	/**
	 * CompareRows
	 */
	CompareRows?: ICompareRowEntity[] | null;

	/**
	 * CompareType
	 */
	CompareType: CompareTypes;

	/**
	 * RfqHeaderId
	 */
	RfqHeaderId: number;
}
