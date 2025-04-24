/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobCardGroupEntity extends IEntityBase, IEntityIdentification {
	DivisionFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Remark: string;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	Icon: number;
}
