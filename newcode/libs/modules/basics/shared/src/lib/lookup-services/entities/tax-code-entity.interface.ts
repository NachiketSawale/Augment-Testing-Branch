/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

/**
 * Tax code entity
 */
export interface ITaxCodeEntity extends IEntityBase,IEntityIdentification {
	Id: number;
	DescriptionInfo?: IDescriptionInfo;
	LedgerContextFk: number;
	Code: string;
	VatPercent: number;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
	IsLive: boolean;
	CodeFinance: string;
	VatPercentDominant?: number;
}