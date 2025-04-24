/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCostCodeTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsEstimateCc: boolean;
	IsRevenueCc: boolean;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	IsMounting: boolean;
	IsAllowance: boolean;
	Isrp: boolean;
	Isga: boolean;
	Isam: boolean;
	IsCommissioning: boolean;
	HasOrder: boolean;
	IsInformation: boolean;
}
