/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDue: boolean;
	IsActual: boolean;
	IsPlanned: boolean;
	IsDefault: boolean;
	TrafficlightFk: number;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
}
