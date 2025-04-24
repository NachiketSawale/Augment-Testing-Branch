/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingComponentStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	Isdeletable: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsLive: boolean;
	Code: string;
}
