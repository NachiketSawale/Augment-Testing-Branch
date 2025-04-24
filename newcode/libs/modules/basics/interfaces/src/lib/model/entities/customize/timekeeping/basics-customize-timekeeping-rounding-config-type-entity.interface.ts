/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingRoundingConfigTypeEntity extends IEntityBase, IEntityIdentification {
	RoundingConfigFk: number;
	TimesheetContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsEnterprise: boolean;
	IsLive: boolean;
}
