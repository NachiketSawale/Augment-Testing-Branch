/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingReportStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	IsApproved: boolean;
	IsLive: boolean;
	Isdeletable: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
}
