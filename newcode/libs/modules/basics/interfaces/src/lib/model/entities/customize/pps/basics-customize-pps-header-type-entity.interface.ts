/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsHeaderTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsForScrap: boolean;
	UserFlag1: boolean;
	UserFlag2: boolean;
	IsForStock: boolean;
	Isforpreliminary: boolean;
}
