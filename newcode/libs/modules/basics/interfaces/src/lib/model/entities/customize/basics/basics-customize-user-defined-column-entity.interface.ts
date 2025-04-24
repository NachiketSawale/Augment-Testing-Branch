/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeUserDefinedColumnEntity extends IEntityBase, IEntityIdentification {
	Code: number;
	DescriptionInfo?: IDescriptionInfo;
	IsLive: boolean;
	Sorting: number;
}
