/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectActionTypeEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
