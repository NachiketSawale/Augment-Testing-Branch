/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResourceSkillGroupEntity extends IEntityBase, IEntityIdentification {
	SkillgroupFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	Remark: string;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
