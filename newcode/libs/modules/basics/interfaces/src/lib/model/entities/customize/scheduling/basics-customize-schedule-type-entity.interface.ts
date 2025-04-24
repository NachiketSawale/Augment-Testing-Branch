/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeScheduleTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	SchedulingContextFk: number;
	RubricCategoryFk: number;
	Isexecution: boolean;
	Isprocurement: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	CodeFormatFk: number;
}
