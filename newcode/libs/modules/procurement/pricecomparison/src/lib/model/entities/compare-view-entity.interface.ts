/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface ICompareViewEntity extends IEntityBase {

	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * CompareColumns
	 */
	CompareColumns?: ICustomCompareColumnEntity[] | null;

	/**
	 * CompareType
	 */
	CompareType: number;

	/**
	 * DeletedColumns
	 */
	DeletedColumns?: ICustomCompareColumnEntity[] | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsLoadBase
	 */
	IsLoadBase: boolean;

	/**
	 * OldQuoteIds
	 */
	OldQuoteIds?: number[] | null;

	/**
	 * RfqHeaderFk
	 */
	RfqHeaderFk: number;
}
