/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsSettlementStatusEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsReadOnly: boolean;
	IsBilled: boolean;
	IsStorno: boolean;
	IsDefault: boolean;
	Icon: number;
	Sorting: number;
	IsLive: boolean;
	IsTestRun: boolean;
	IsRevision: boolean;
	Code: string;
}
