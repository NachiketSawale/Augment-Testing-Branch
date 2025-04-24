/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsPhaseTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	RubricCategoryFk: number;
	DateShiftMode: number;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	UserFlag1: boolean;
	UserFlag2: boolean;
}
