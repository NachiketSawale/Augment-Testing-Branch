/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMilestoneTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	Iscritical: boolean;
	Isinformationonly: boolean;
	IsLive: boolean;
}
