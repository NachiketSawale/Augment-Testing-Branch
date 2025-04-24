/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	Isdeletable: boolean;
	IsLive: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
}
