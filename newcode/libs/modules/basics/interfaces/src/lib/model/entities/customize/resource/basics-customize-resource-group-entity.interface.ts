/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResourceGroupEntity extends IEntityBase, IEntityIdentification {
	GroupFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
}
