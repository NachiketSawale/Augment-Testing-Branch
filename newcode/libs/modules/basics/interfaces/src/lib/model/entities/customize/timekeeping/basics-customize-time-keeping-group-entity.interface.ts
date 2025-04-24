/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimeKeepingGroupEntity extends IEntityBase, IEntityIdentification {
	TimesheetContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
}
