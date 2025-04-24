/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IPrcGeneralsTypeEntity extends IEntityIdentification, IEntityBase {
	LedgerContextFk: number;
	DescriptionInfo: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsCost: boolean;
	IsPercent: boolean;
	IsLive: boolean;
	CrbPriceconditionTypeFk?: number;
	IsSales: boolean;
	IsProcurement: boolean;
	ValueType: number;
}