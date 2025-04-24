/*
 * Copyright(c) RIB Software GmbH
 */

import { IMdcTaxCodeMatrixEntity } from './mdc-tax-code-matrix-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcTaxCodeEntityGenerated extends IEntityBase {
	/**
	 * Code
	 */
	Code: string;

	/**
	 * CodeFinance
	 */
	CodeFinance?: string | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * LedgerContextFk
	 */
	LedgerContextFk: number;

	/**
	 * MdcTaxCodeMatrixEntities
	 */
	MdcTaxCodeMatrixEntities?: IMdcTaxCodeMatrixEntity[] | null;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * VatPercent
	 */
	VatPercent: number;

	/**
	 * VatPercentDominant
	 */
	VatPercentDominant: number;
}
