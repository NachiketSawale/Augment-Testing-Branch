/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsPhaseRequirementStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	IsFullySpecified: boolean;
	IsDone: boolean;
	UserFlag1: boolean;
	UserFlag2: boolean;
}
