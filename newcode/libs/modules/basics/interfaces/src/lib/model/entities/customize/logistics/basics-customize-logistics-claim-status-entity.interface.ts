/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsClaimStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsAccepted: boolean;
	IsRejected: boolean;
	IsFixed: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	Code: string;
	Icon: number;
	Sorting: number;
}
