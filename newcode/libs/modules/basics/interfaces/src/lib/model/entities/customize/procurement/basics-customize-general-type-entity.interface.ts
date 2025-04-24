/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeGeneralTypeEntity extends IEntityBase, IEntityIdentification {
	LedgerContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsCost: boolean;
	IsPercent: boolean;
	IsLive: boolean;
	CrbPriceConditionTypeFk: number;
	IsSales: boolean;
	IsProcurement: boolean;
	ValueType: number;
}
