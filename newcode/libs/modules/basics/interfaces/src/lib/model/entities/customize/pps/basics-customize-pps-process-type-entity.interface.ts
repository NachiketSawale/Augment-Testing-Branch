/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProcessTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	Icon: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsPlaceHolder: boolean;
	Sorting: number;
	UserFlag1: boolean;
	UserFlag2: boolean;
}
