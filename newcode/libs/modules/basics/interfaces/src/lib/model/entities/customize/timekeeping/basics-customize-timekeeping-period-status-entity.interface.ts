/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingPeriodStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsReadOnly: boolean;
	IsApproved: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	Code: string;
}
