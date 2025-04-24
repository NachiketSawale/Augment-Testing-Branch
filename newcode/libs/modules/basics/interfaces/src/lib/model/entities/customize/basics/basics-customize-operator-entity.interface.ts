/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOperatorEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	ConditionTypeFk: number;
	DisplaydomainFk: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
