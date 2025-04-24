/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeAccountingEntity extends IEntityBase, IEntityIdentification {
	LedgerContextFk: number;
	Code: string;
	Description2Info?: IDescriptionInfo;
	IsBalanceSheet: boolean;
	IsProfitAndLoss: boolean;
	IsCostCode: boolean;
	IsRevenueCode: boolean;
	DescriptionInfo?: IDescriptionInfo;
	IsSurcharge: boolean;
}
