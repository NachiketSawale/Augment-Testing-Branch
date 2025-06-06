/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsSettlementItemTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsLive: boolean;
	IsDefault: boolean;
	Icon: number;
}
