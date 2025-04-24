/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstimationTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsBid: boolean;
	Isjob: boolean;
	GuidGrid: number;
	GuidDetail: number;
	GuidResGrid: number;
	GuidResDetail: number;
	IsTotalWq: boolean;
	IsTotalAqBudget: boolean;
	IsWqReadOnly: boolean;
	Isgc: boolean;
	IsBudgetEditable: boolean;
}
