/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification, IEntityBase } from '@libs/platform/common';

/**
 * Tax Code entity interface
 */
export interface IBasicsTaxCodeEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	DescriptionInfo?: IDescriptionInfo;
	LedgerContextFk: number;
	Code: string;
	VatPercent?: number;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	IsLive: boolean;
	CodeFinance: string;
	VatPercentDominant?: number;
}