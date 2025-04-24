/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsHeaderStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	Backgroundcolor: number;
	Fontcolor: number;
	Isinproduction: boolean;
	Isdeletable: boolean;
	IsDefault: boolean;
	IsLive: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsDone: boolean;
}
