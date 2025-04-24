/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	RubricCategoryFk: number;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	IsReproduction: boolean;
	UserFlag1: boolean;
	UserFlag2: boolean;
	ItemFilterOptionsFk: number;
}
