/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobCardAreaEntity extends IEntityBase, IEntityIdentification {
	DivisionFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Remark: string;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	Icon: number;
}
